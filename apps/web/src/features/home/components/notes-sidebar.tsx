"use client";

import { Menu, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/wordmark";
import { Tooltip } from "@/components/ui/tooltip";
import type { Note } from "@/features/home/data/mock-notes";

interface NotesSidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onNewNote: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function NotesSidebar({ notes, activeNoteId, onSelectNote, onNewNote, isOpen, onToggle }: NotesSidebarProps) {
  function handleSelectNote(id: string) {
    onSelectNote(id);
    if (window.innerWidth < 768) onToggle();
  }

  function handleNewNote() {
    onNewNote();
    if (window.innerWidth < 768) onToggle();
  }

  return (
    <>
      {isOpen ? (
        <div role="presentation" onClick={onToggle} className="fixed inset-0 z-20 bg-foreground/20 md:hidden" />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex h-full w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 ease-out md:static md:transition-[margin-left,width]",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          isOpen ? "md:ml-0 md:w-72" : "md:-ml-72 md:w-72",
        )}
      >
        <div className="flex items-center justify-between px-5 pt-[max(env(safe-area-inset-top),24px)] pb-6">
          <button type="button" onClick={handleNewNote} aria-label="New note">
            <Wordmark className="text-lg" />
          </button>
          <Tooltip content="Close sidebar" side="right">
            <button
              type="button"
              onClick={onToggle}
              aria-label="Collapse sidebar"
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <PanelLeft className="size-4" />
            </button>
          </Tooltip>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 pb-4">
          <ul className="flex flex-col gap-0.5">
            {notes.map((note) => (
              <li key={note.id}>
                <button
                  type="button"
                  onClick={() => handleSelectNote(note.id)}
                  className={cn(
                    "w-full truncate rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    activeNoteId === note.id && "bg-sidebar-accent text-sidebar-accent-foreground",
                  )}
                >
                  {note.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {!isOpen ? (
        <div className="fixed left-4 top-[max(env(safe-area-inset-top),24px)] z-30">
          <button
            type="button"
            onClick={onToggle}
            aria-label="Open sidebar"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted md:hidden"
          >
            <Menu className="size-5" />
          </button>
          <Tooltip content="Open sidebar" side="right">
            <button
              type="button"
              onClick={onToggle}
              aria-label="Open sidebar"
              className="group hidden size-8 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted md:flex"
            >
              <span className="font-wordmark text-lg font-extrabold tracking-tight lowercase group-hover:hidden">
                n.
              </span>
              <PanelLeft className="hidden size-4 group-hover:block" />
            </button>
          </Tooltip>
        </div>
      ) : null}
    </>
  );
}
