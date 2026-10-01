"use client";

import { useState, useRef, useEffect } from "react";
import { NodeViewWrapper, NodeViewContent, type NodeViewProps } from "@tiptap/react";
import { ChevronDown } from "lucide-react";
import { CALLOUT_VARIANTS, type CalloutVariant } from "../config/callout-variants";
import { cn } from "@/lib/utils";

export function CalloutNodeView({ node, updateAttributes }: NodeViewProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const rawVariant = (node.attrs.variant as CalloutVariant) || "takeaway";
  const config = CALLOUT_VARIANTS[rawVariant] || CALLOUT_VARIANTS.takeaway;
  const Icon = config.icon;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelectVariant(variant: CalloutVariant) {
    updateAttributes({ variant });
    setIsDropdownOpen(false);
  }

  return (
    <NodeViewWrapper className="my-4 not-prose">
      <div
        className={cn(
          "relative flex flex-col rounded-xl border p-4 transition-all duration-200 shadow-xs",
          config.containerClass,
        )}
      >
        {/* Header bar - contentEditable=false and stopPropagation prevents ProseMirror from stealing focus */}
        <div
          contentEditable={false}
          className="flex items-center justify-between mb-2.5 select-none"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold select-none shadow-2xs",
                config.badgeClass,
              )}
            >
              <Icon className={cn("size-3.5", config.iconClass)} aria-hidden />
              <span>{config.badgeLabel}</span>
            </span>
          </div>

          {/* Custom Dropdown Switcher */}
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen((prev) => !prev);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-card/80 px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer shadow-2xs"
              aria-label="Change callout variant"
              aria-expanded={isDropdownOpen}
            >
              <span>{config.label}</span>
              <ChevronDown className="size-3 opacity-60" />
            </button>

            {isDropdownOpen && (
              <div
                className="absolute right-0 top-full mt-1 w-44 rounded-lg border border-border bg-card p-1 shadow-lg z-50 animate-in fade-in duration-100"
                onMouseDown={(e) => e.stopPropagation()}
              >
                {(Object.keys(CALLOUT_VARIANTS) as CalloutVariant[]).map((variantKey) => {
                  const itemConfig = CALLOUT_VARIANTS[variantKey];
                  const ItemIcon = itemConfig.icon;
                  const isCurrent = variantKey === rawVariant;

                  return (
                    <button
                      key={variantKey}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectVariant(variantKey);
                      }}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-left transition-colors cursor-pointer",
                        isCurrent
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground hover:bg-muted",
                      )}
                    >
                      <ItemIcon className={cn("size-3.5", itemConfig.iconClass)} />
                      <span>{itemConfig.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* The editable slot for child blocks (paragraphs, lists, etc.) */}
        <NodeViewContent className="min-w-0 text-[0.95rem] leading-7 text-foreground/95" />
      </div>
    </NodeViewWrapper>
  );
}
