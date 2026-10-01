"use client";

import { Menu, PanelLeft, SquarePen, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/wordmark";
import { Tooltip } from "@/components/ui/tooltip";
import type { NoteSummary } from "@notter/types";

interface NotesSidebarProps {
  notes: NoteSummary[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onNewNote: () => void;
  onDeleteNote?: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function NotesSidebar({
  notes,
  activeNoteId,
  onSelectNote,
  onNewNote,
  onDeleteNote,
  isOpen,
  onToggle,
}: NotesSidebarProps) {
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
          <Wordmark className="text-lg" />
          <Tooltip content="Close sidebar" side="right">
            <button
              type="button"
              onClick={onToggle}
              aria-label="Collapse sidebar"
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer"
            >
              <PanelLeft className="size-4" />
            </button>
          </Tooltip>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 pb-4">
          <div className="mb-2">
            <button
              type="button"
              onClick={handleNewNote}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer",
                activeNoteId === null && "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
              )}
            >
              <SquarePen className="size-4 shrink-0 text-sidebar-foreground/80" />
              <span>New note</span>
            </button>
          </div>

          <ul className="flex flex-col gap-0.5">
            {notes.map((note) => (
              <li key={note.id} className="group relative flex items-center">
                <button
                  type="button"
                  onClick={() => handleSelectNote(note.id)}
                  className={cn(
                    "w-full truncate rounded-lg py-2 pl-3 pr-8 text-left text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer",
                    activeNoteId === note.id && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                  )}
                  title={note.title}
                >
                  {note.title}
                </button>
                {onDeleteNote ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNote(note.id);
                    }}
                    className="absolute right-1.5 hidden size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive group-hover:flex cursor-pointer"
                    aria-label={`Delete ${note.title}`}
                    title="Delete note"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                ) : null}
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
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted md:hidden cursor-pointer"
          >
            <Menu className="size-5" />
          </button>
          <Tooltip content="Open sidebar" side="right">
            <button
              type="button"
              onClick={onToggle}
              aria-label="Open sidebar"
              className="group hidden size-8 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted md:flex cursor-pointer"
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
