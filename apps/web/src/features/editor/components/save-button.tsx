"use client";

import { Save, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SaveButtonProps {
  isDirty: boolean;
  onSave: () => void;
  className?: string;
}

export function SaveButton({ isDirty, onSave, className }: SaveButtonProps) {
  return (
    <button
      type="button"
      onClick={onSave}
      disabled={!isDirty}
      aria-label={isDirty ? "Save changes" : "All changes saved"}
      title={isDirty ? "Save changes" : "Saved"}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-all duration-200 cursor-pointer shadow-xs disabled:cursor-not-allowed",
        isDirty
          ? "bg-primary text-primary-foreground hover:opacity-90 active:scale-95"
          : "bg-muted text-muted-foreground/70 opacity-60",
        className,
      )}
    >
      {isDirty ? (
        <>
          <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
          <Save className="size-3.5" />
          <span>Save</span>
        </>
      ) : (
        <>
          <Check className="size-3.5 text-emerald-500" />
          <span>Saved</span>
        </>
      )}
    </button>
  );
}
