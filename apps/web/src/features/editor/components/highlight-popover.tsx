"use client";

import { useState, useRef, useEffect } from "react";
import type { Editor } from "@tiptap/react";
import { Highlighter, Ban } from "lucide-react";
import { HIGHLIGHT_COLORS } from "../config/highlight-colors";
import { cn } from "@/lib/utils";

interface HighlightPopoverProps {
  editor: Editor;
}

export function HighlightPopover({ editor }: HighlightPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isHighlighted = editor.isActive("highlight");

  function applyHighlight(color: string) {
    editor.chain().focus().setHighlight({ color }).run();
    setIsOpen(false);
  }

  function removeHighlight() {
    editor.chain().focus().unsetHighlight().run();
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs font-medium transition-colors cursor-pointer",
          isHighlighted
            ? "bg-primary/15 text-primary font-semibold"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
        aria-label="Text Highlight"
        title="Highlight"
      >
        <Highlighter className="size-3.5" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 flex items-center gap-1.5 rounded-lg border border-border bg-card p-1.5 shadow-lg z-50 animate-in fade-in duration-100">
          {HIGHLIGHT_COLORS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => applyHighlight(item.color)}
              title={item.name}
              aria-label={`Highlight ${item.name}`}
              className={cn(
                "size-6 rounded-full border transition-transform hover:scale-110 cursor-pointer shadow-xs",
                item.twBadgeClass,
              )}
              style={{ backgroundColor: item.color }}
            />
          ))}

          <div className="h-4 w-px bg-border/60 mx-0.5" />

          <button
            type="button"
            onClick={removeHighlight}
            title="Remove Highlight"
            aria-label="Remove Highlight"
            className="flex size-6 items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
          >
            <Ban className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
