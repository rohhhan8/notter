"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";
import { createOnboardingClient, createProfileClient, createNotesClient } from "@notter/api-client";
import type { Profile } from "@notter/types";
import { getApiBaseUrl } from "@/lib/env";
import { LoadingScreen } from "@/components/loading-screen";
import { NotesSidebar } from "@/features/home/components/notes-sidebar";
import { NoteView } from "@/features/home/components/note-view";
import { PromptComposer } from "@/features/home/components/prompt-composer";
import { mockNotes, type Note } from "@/features/home/data/mock-notes";
import { ProfileModal } from "@/features/profile/components/profile-modal";
import { toast } from "@/components/ui/toast";

const NOTES_STORAGE_KEY = "notter_user_notes";

function getInitialNotes(): Note[] {
  if (typeof window === "undefined") return mockNotes;
  try {
    const saved = localStorage.getItem(NOTES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return mockNotes;
}

export function HomeShell() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>(getInitialNotes);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => typeof window !== "undefined" && window.innerWidth >= 768);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
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
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    } catch {
      // ignore
    }
  }, [notes]);

  async function handleSignOut() {
    const client = createOnboardingClient({ baseUrl: getApiBaseUrl() });
    await client.signOut();
    router.push("/onboarding");
  }

  function handleNewNote() {
    setActiveNoteId(null);
  }

  async function handlePromptSubmit(prompt: string) {
    setIsGenerating(true);
    const newId = crypto.randomUUID();
    const initialTitle = prompt.length > 50 ? `${prompt.slice(0, 50)}…` : prompt;

    const newNote: Note = {
      id: newId,
      title: initialTitle,
      content: "",
      createdAt: new Date().toISOString(),
    };

    setNotes((current) => [newNote, ...current]);
    setActiveNoteId(newId);

    try {
      const client = createNotesClient({ baseUrl: getApiBaseUrl() });
      let accumulated = "";

      await client.generateStream({
        prompt,
        intent: profile?.intent,
        onDelta: (delta) => {
          accumulated += delta;

          // Check if markdown title has streamed in (e.g. # Some Title)
          let dynamicTitle = initialTitle;
          const match = accumulated.match(/^#\s+([^\n]+)/);
          if (match && match[1]) {
            dynamicTitle = match[1].trim();
          }

          setNotes((current) =>
            current.map((n) =>
              n.id === newId
                ? {
                    ...n,
                    title: dynamicTitle,
                    content: accumulated,
                  }
                : n
            )
          );
        },
      });
      toast.success("Note created successfully");
    } catch (error) {
      console.error("Failed to generate note:", error);
      toast.error("Failed to generate note", "Please check your network and try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  if (!profile) {
    return <LoadingScreen />;
  }

  const activeNote = notes.find((note) => note.id === activeNoteId) ?? null;

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <NotesSidebar
        notes={notes}
        activeNoteId={activeNoteId}
        onSelectNote={setActiveNoteId}
        onNewNote={handleNewNote}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((open) => !open)}
      />

      <div className="relative flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-end px-6 pt-[max(env(safe-area-inset-top),24px)] pb-4">
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

        {activeNote ? (
          <>
            <main className="flex-1 overflow-y-auto px-6 py-8">
              <NoteView note={activeNote} isStreaming={isGenerating && activeNoteId === activeNote.id} />
            </main>
            <div className="px-6 pb-[max(env(safe-area-inset-bottom),24px)]">
              <PromptComposer onSubmit={handlePromptSubmit} isGenerating={isGenerating} className="mx-auto max-w-2xl" />
            </div>
          </>
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
            <PromptComposer onSubmit={handlePromptSubmit} isGenerating={isGenerating} className="max-w-2xl" />
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
