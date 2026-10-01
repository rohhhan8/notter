"use client";

import { NodeViewWrapper, NodeViewContent, type NodeViewProps } from "@tiptap/react";
import { CALLOUT_VARIANTS, type CalloutVariant } from "../config/callout-variants";
import { cn } from "@/lib/utils";

export function CalloutNodeView({ node, updateAttributes }: NodeViewProps) {
  const rawVariant = (node.attrs.variant as CalloutVariant) || "takeaway";
  const config = CALLOUT_VARIANTS[rawVariant] || CALLOUT_VARIANTS.takeaway;
  const Icon = config.icon;

  return (
    <NodeViewWrapper className="my-4 not-prose">
      <div
        className={cn(
          "relative flex flex-col rounded-xl border p-4 transition-all duration-200 shadow-xs",
          config.containerClass,
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold select-none",
                config.badgeClass,
              )}
            >
              <Icon className={cn("size-3.5", config.iconClass)} aria-hidden />
              <span>{config.badgeLabel}</span>
            </span>
          </div>

          {/* Quick variant switcher on the callout */}
          <select
            value={rawVariant}
            onChange={(e) => updateAttributes({ variant: e.target.value as CalloutVariant })}
            className="text-[11px] font-medium text-muted-foreground bg-transparent border border-border/40 rounded-md px-1.5 py-0.5 outline-none hover:bg-muted/50 cursor-pointer"
            aria-label="Change callout variant"
          >
            <option value="takeaway">Takeaway</option>
            <option value="info">Info</option>
            <option value="important">Important</option>
            <option value="warning">Warning</option>
          </select>
        </div>

        {/* The editable slot for child blocks (paragraphs, lists, etc.) */}
        <NodeViewContent className="min-w-0 text-[0.95rem] leading-7 text-foreground/95" />
      </div>
    </NodeViewWrapper>
  );
}
