"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Settings, Loader2 } from "lucide-react";
import { createOnboardingClient, createProfileClient, createNotesClient } from "@notter/api-client";
import type { Profile, Note, NoteSummary, NoteMode } from "@notter/types";
import { getApiBaseUrl } from "@/lib/env";
import { LoadingScreen } from "@/components/loading-screen";
import { NotesSidebar } from "@/features/home/components/notes-sidebar";
import { PromptComposer } from "@/features/home/components/prompt-composer";
import { NoterEditor, HARDCODED_TEST_DOCUMENT } from "@/features/editor";
import type { JSONContent } from "@tiptap/react";
import { ProfileModal } from "@/features/profile/components/profile-modal";
import { toast } from "@/components/ui/toast";

export function HomeShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlNoteId = searchParams.get("noteId");

  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [notes, setNotes] = useState<NoteSummary[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(() => urlNoteId);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [prevUrlNoteId, setPrevUrlNoteId] = useState<string | null>(urlNoteId);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => typeof window !== "undefined" && window.innerWidth >= 768);

  // Derived loading state: true when an activeNoteId is selected but its full content is not yet loaded
  const isLoadingNote = Boolean(activeNoteId && (!activeNote || activeNote.id !== activeNoteId));

  // React 19: Adjust state during render when URL search param changes
  if (urlNoteId !== prevUrlNoteId) {
    setPrevUrlNoteId(urlNoteId);
    setActiveNoteId(urlNoteId);
    if (!urlNoteId) {
      setActiveNote(null);
    }
  }

  const fetchNotes = useCallback(async () => {
    try {
      const client = createNotesClient({ baseUrl: getApiBaseUrl() });
      const userNotes = await client.list();
      setNotes(userNotes);
    } catch (err) {
      console.warn("Could not fetch remote notes:", err);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadProfileAndNotes() {
      const onboardingClient = createOnboardingClient({ baseUrl: getApiBaseUrl() });
      const session = await onboardingClient.getSession();

      if (cancelled) return;

      if (!session) {
        router.replace("/onboarding");
        return;
      }

      const profileClient = createProfileClient({ baseUrl: getApiBaseUrl() });
      const result = await profileClient.getCurrent();
      if (cancelled) return;

      if (!result) {
        router.replace("/onboarding/profile");
        return;
      }

      setProfile(result);
      await fetchNotes();
    }

    loadProfileAndNotes();

    return () => {
      cancelled = true;
    };
  }, [router, fetchNotes]);

  // Dedicated GET by ID effect: when activeNoteId changes, fetch complete note content
  useEffect(() => {
    if (!activeNoteId) return;

    // If active note is already populated for this ID, avoid duplicate fetch
    if (activeNote && activeNote.id === activeNoteId && activeNote.document) {
      return;
    }

    let cancelled = false;

    async function loadNoteById() {
      try {
        const client = createNotesClient({ baseUrl: getApiBaseUrl() });
        const fetched = await client.get(activeNoteId!);
        if (!cancelled) {
          setActiveNote(fetched);
        }
      } catch (error) {
        console.error(`Failed to fetch note ${activeNoteId}:`, error);
        if (!cancelled) {
          toast.error("Failed to load note content");
        }
      }
    }

    loadNoteById();

    return () => {
      cancelled = true;
    };
  }, [activeNoteId, activeNote]);

  async function handleSignOut() {
    const client = createOnboardingClient({ baseUrl: getApiBaseUrl() });
    await client.signOut();
    router.push("/onboarding");
  }

  // ChatGPT pattern: New note merely resets to the empty prompt screen, NO database insert
  function handleNewNote() {
    setActiveNoteId(null);
    setActiveNote(null);
    router.push("/home");
  }

  function handleSelectNote(id: string) {
    setActiveNoteId(id);
    router.push(`/home?noteId=${encodeURIComponent(id)}`);
  }

  async function handleDeleteNote(id: string) {
    try {
      const client = createNotesClient({ baseUrl: getApiBaseUrl() });
      await client.delete(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (activeNoteId === id) {
        setActiveNoteId(null);
        setActiveNote(null);
        router.push("/home");
      }
      toast.success("Note deleted");
    } catch (error) {
      console.error("Failed to delete note:", error);
      toast.error("Failed to delete note");
    }
  }

  async function handleSaveDocument(savedDoc: Record<string, unknown>, newTitle?: string) {
    if (!activeNoteId) return;
    try {
      const client = createNotesClient({ baseUrl: getApiBaseUrl() });
      const updated = await client.update(activeNoteId, {
        document: savedDoc,
        ...(newTitle ? { title: newTitle.trim() } : {}),
      });

      setActiveNote(updated);
      setNotes((prev) =>
        prev.map((n) =>
          n.id === activeNoteId
            ? { ...n, title: updated.title, updatedAt: updated.updatedAt }
            : n
        )
      );
      toast.success("Document saved successfully");
    } catch (error) {
      console.error("Failed to save note document:", error);
      toast.error("Failed to save document");
    }
  }

  async function handlePromptSubmit(prompt: string, mode?: NoteMode) {
    setIsGenerating(true);

    try {
      const client = createNotesClient({ baseUrl: getApiBaseUrl() });

      // Plain CRUD note creation: split input text into clean Tiptap paragraphs
      const lines = prompt
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      const title = lines[0]
        ? lines[0].length > 40
          ? `${lines[0].slice(0, 40)}…`
          : lines[0]
        : "Untitled Note";

      const contentNodes =
        lines.length > 0
          ? lines.map((line) => ({
              type: "paragraph" as const,
              content: [{ type: "text" as const, text: line }],
            }))
          : [{ type: "paragraph" as const }];

      const document = {
        type: "doc",
        content: contentNodes,
      };

      const created = await client.create({
        title,
        document,
        mode: mode || "general",
      });

      if (created) {
        const summary: NoteSummary = {
          id: created.id,
          title: created.title,
          mode: created.mode,
          createdAt: created.createdAt,
          updatedAt: created.updatedAt,
        };
        setNotes((prev) => [summary, ...prev.filter((n) => n.id !== created.id)]);
        setActiveNote(created);
        setActiveNoteId(created.id);
        router.push(`/home?noteId=${encodeURIComponent(created.id)}`);
        toast.success("Note created successfully");
      }
    } catch (error) {
      console.error("Failed to create note:", error);
      toast.error("Failed to create note", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  if (!profile) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <NotesSidebar
        notes={notes}
        activeNoteId={activeNoteId}
        onSelectNote={handleSelectNote}
        onNewNote={handleNewNote}
        onDeleteNote={handleDeleteNote}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((open) => !open)}
      />

      <div className="relative flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-end px-3 sm:px-6 pt-[max(env(safe-area-inset-top),16px)] sm:pt-[max(env(safe-area-inset-top),24px)] pb-2 sm:pb-4">
          <button
            type="button"
            onClick={() => setIsProfileModalOpen(true)}
            aria-label="Profile and Settings"
            className="flex items-center gap-2.5 rounded-full border border-border bg-card/60 py-1.5 pl-2 pr-3 text-xs font-medium text-foreground transition-colors hover:bg-muted cursor-pointer"
          >
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[10px] border border-primary/20">
              {profile.fullName
                .split(" ")
                .map((n) => n[0])
                .filter(Boolean)
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
            <span className="hidden sm:inline font-medium">{profile.fullName.split(" ")[0]}</span>
            <Settings className="size-3.5 text-muted-foreground" />
          </button>
        </header>

        {activeNoteId ? (
          isLoadingNote || !activeNote ? (
            <main className="flex-1 min-h-0 flex flex-col px-2.5 sm:px-6 pt-0 pb-2 sm:pb-3 overflow-hidden">
              <div className="mx-auto max-w-3xl w-full flex-1 min-h-0 flex flex-col rounded-2xl border border-border bg-card p-8 items-center justify-center gap-3">
                <Loader2 className="size-6 animate-spin text-primary" />
                <p className="text-xs font-mono text-muted-foreground">Loading note content...</p>
              </div>
            </main>
          ) : (
            <>
              <main className="flex-1 min-h-0 flex flex-col px-2.5 sm:px-6 pt-0 pb-2 sm:pb-3 overflow-hidden">
                <div className="mx-auto max-w-3xl w-full flex-1 min-h-0 flex flex-col">
                  <NoterEditor
                    key={activeNote.id}
                    initialDocument={(activeNote.document as JSONContent) ?? HARDCODED_TEST_DOCUMENT}
                    title={activeNote.title}
                    mode={activeNote.mode}
                    className="flex-1 min-h-0"
                    onSave={handleSaveDocument}
                  />
                </div>
              </main>
              <div className="px-3 sm:px-6 pb-[max(env(safe-area-inset-bottom),16px)] sm:pb-[max(env(safe-area-inset-bottom),24px)]">
                <PromptComposer
                  onSubmit={handlePromptSubmit}
                  isGenerating={isGenerating}
                  className="mx-auto max-w-2xl"
                  dropdownPosition="top"
                />
              </div>
            </>
          )
        ) : (
          <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">
                {profile.fullName.split(" ")[0]}, what&apos;s on your mind?
              </p>
              <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Capture, clarify, create.
              </h1>
            </div>
            <PromptComposer
              onSubmit={handlePromptSubmit}
              isGenerating={isGenerating}
              className="max-w-2xl"
              dropdownPosition="bottom"
            />
          </main>
        )}
      </div>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onProfileUpdate={(updated) => setProfile(updated)}
        onSignOut={handleSignOut}
      />
    </div>
  );
}
