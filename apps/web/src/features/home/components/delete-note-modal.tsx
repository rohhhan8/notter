"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";

interface DeleteNoteModalProps {
  isOpen: boolean;
  noteTitle: string;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export function DeleteNoteModal({
  isOpen,
  noteTitle,
  onClose,
  onConfirm,
}: DeleteNoteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !isDeleting) {
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  async function handleConfirm() {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
      onClose();
    }
  }

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-note-title"
      aria-describedby="delete-note-description"
      className="fixed inset-0 z-60 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        role="presentation"
        onClick={() => !isDeleting && onClose()}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
            <AlertTriangle className="size-5.5" />
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            aria-label="Close"
            className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer disabled:pointer-events-none"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-4">
          <h2 id="delete-note-title" className="font-heading text-lg font-bold tracking-tight text-foreground">
            Delete Note?
          </h2>
          <p id="delete-note-description" className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground break-all">
              &ldquo;{noteTitle.trim() || "Untitled Note"}&rdquo;
            </span>
            ? This action cannot be undone and will permanently remove this note and its contents.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-full border border-border bg-muted/60 px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-destructive px-5 py-2 text-xs font-semibold text-destructive-foreground transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Deleting…</span>
              </>
            ) : (
              <span>Delete Note</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
