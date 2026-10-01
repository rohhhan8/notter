"use client";

import { useState, useRef } from "react";
import type { Editor } from "@tiptap/react";
import { MessageSquarePlus, ChevronDown } from "lucide-react";
import { CALLOUT_VARIANTS, type CalloutVariant } from "../config/callout-variants";
import { cn } from "@/lib/utils";
import { DropdownPortal } from "./dropdown-portal";

interface CalloutSelectorProps {
  editor: Editor;
}

export function CalloutSelector({ editor }: CalloutSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isCalloutActive = editor.isActive("callout");

  function insertCallout(variant: CalloutVariant) {
    editor.chain().focus().toggleCallout({ variant }).run();
    setIsOpen(false);
  }

  return (
    <div className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "inline-flex h-8 shrink-0 items-center gap-1 rounded-md px-2 text-xs font-medium transition-colors cursor-pointer",
          isCalloutActive
            ? "bg-primary/15 text-primary font-semibold"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
        aria-label="Insert Callout"
        title="Callout Box"
      >
        <MessageSquarePlus className="size-3.5" />
        <span className="hidden sm:inline">Callout</span>
        <ChevronDown className="size-3 opacity-60" />
      </button>

      <DropdownPortal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        triggerRef={buttonRef}
        width={176}
        className="w-44 rounded-lg border border-border bg-card p-1 shadow-xl animate-in fade-in duration-100"
      >
        {(Object.keys(CALLOUT_VARIANTS) as CalloutVariant[]).map((variantKey) => {
          const config = CALLOUT_VARIANTS[variantKey];
          const Icon = config.icon;
          const isCurrent = editor.isActive("callout", { variant: variantKey });

          return (
            <button
              key={variantKey}
              type="button"
              onClick={() => insertCallout(variantKey)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-left transition-colors cursor-pointer",
                isCurrent
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-foreground hover:bg-muted",
              )}
            >
              <Icon className={cn("size-3.5", config.iconClass)} />
              <span>{config.label}</span>
            </button>
          );
        })}
      </DropdownPortal>
    </div>
  );
}

