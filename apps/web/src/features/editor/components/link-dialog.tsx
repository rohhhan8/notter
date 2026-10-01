"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import type { Editor } from "@tiptap/react";
import { Link2, Unlink, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface LinkDialogProps {
  editor: Editor;
}

export function LinkDialog({ editor }: LinkDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLinkActive = editor.isActive("link");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleToggleOpen() {
    if (!isOpen) {
      const previousUrl = (editor.getAttributes("link").href as string) || "";
      setUrl(previousUrl);
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setIsOpen(false);
    }
  }

  function handleApply(e: FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();

    if (!trimmed) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setIsOpen(false);
      return;
    }

    // Basic URL validation / normalization
    const safeUrl = /^https?:\/\//i.test(trimmed) || trimmed.startsWith("mailto:")
      ? trimmed
      : `https://${trimmed}`;

    editor.chain().focus().extendMarkRange("link").setLink({ href: safeUrl }).run();
    setIsOpen(false);
  }

  function handleRemove() {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handleToggleOpen}
        className={cn(
          "inline-flex h-8 items-center justify-center rounded-md px-2 text-xs font-medium transition-colors cursor-pointer",
          isLinkActive
            ? "bg-primary/15 text-primary font-semibold"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
        aria-label="Insert or edit link"
        title="Link"
      >
        <Link2 className="size-3.5" />
      </button>

      {isOpen && (
        <form
          onSubmit={handleApply}
          className="absolute top-full left-0 mt-1 flex w-64 items-center gap-1.5 rounded-lg border border-border bg-card p-1.5 shadow-lg z-50 animate-in fade-in duration-100"
        >
          <input
            ref={inputRef}
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 min-w-0 rounded-md border border-border/80 bg-background px-2 py-1 text-xs text-foreground outline-none focus:border-primary"
          />
          <button
            type="submit"
            title="Save URL"
            aria-label="Save link"
            className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Check className="size-3.5" />
          </button>
          {isLinkActive && (
            <button
              type="button"
              onClick={handleRemove}
              title="Remove link"
              aria-label="Remove link"
              className="flex size-7 shrink-0 items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
            >
              <Unlink className="size-3.5" />
            </button>
          )}
        </form>
      )}
    </div>
  );
}
