"use client";

import { useState, useRef } from "react";
import type { Editor } from "@tiptap/react";
import { ChevronDown, Heading1, Heading2, Heading3, Pilcrow } from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownPortal } from "./dropdown-portal";

interface HeadingSelectorProps {
  editor: Editor;
}

export function HeadingSelector({ editor }: HeadingSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isH1 = editor.isActive("heading", { level: 1 });
  const isH2 = editor.isActive("heading", { level: 2 });
  const isH3 = editor.isActive("heading", { level: 3 });

  let currentLabel = "Paragraph";
  let CurrentIcon = Pilcrow;

  if (isH1) {
    currentLabel = "Heading 1";
    CurrentIcon = Heading1;
  } else if (isH2) {
    currentLabel = "Heading 2";
    CurrentIcon = Heading2;
  } else if (isH3) {
    currentLabel = "Heading 3";
    CurrentIcon = Heading3;
  }

  return (
    <div className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer shrink-0"
        aria-label="Select text format"
        aria-expanded={isOpen}
      >
        <CurrentIcon className="size-3.5" />
        <span className="hidden sm:inline">{currentLabel}</span>
        <ChevronDown className="size-3 opacity-60" />
      </button>

      <DropdownPortal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        triggerRef={buttonRef}
        width={160}
        className="w-40 rounded-lg border border-border bg-card p-1 shadow-xl animate-in fade-in duration-100"
      >
        <button
          type="button"
          onClick={() => {
            editor.chain().focus().setParagraph().run();
            setIsOpen(false);
          }}
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-left transition-colors cursor-pointer",
            !isH1 && !isH2 && !isH3
              ? "bg-primary/10 text-primary font-semibold"
              : "text-foreground hover:bg-muted",
          )}
        >
          <Pilcrow className="size-3.5" />
          <span>Paragraph</span>
        </button>
        <button
          type="button"
          onClick={() => {
            editor.chain().focus().toggleHeading({ level: 1 }).run();
            setIsOpen(false);
          }}
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-left transition-colors cursor-pointer",
            isH1 ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted",
          )}
        >
          <Heading1 className="size-3.5" />
          <span>Heading 1</span>
        </button>
        <button
          type="button"
          onClick={() => {
            editor.chain().focus().toggleHeading({ level: 2 }).run();
            setIsOpen(false);
          }}
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-left transition-colors cursor-pointer",
            isH2 ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted",
          )}
        >
          <Heading2 className="size-3.5" />
          <span>Heading 2</span>
        </button>
        <button
          type="button"
          onClick={() => {
            editor.chain().focus().toggleHeading({ level: 3 }).run();
            setIsOpen(false);
          }}
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-left transition-colors cursor-pointer",
            isH3 ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted",
          )}
        >
          <Heading3 className="size-3.5" />
          <span>Heading 3</span>
        </button>
      </DropdownPortal>
    </div>
  );
}
