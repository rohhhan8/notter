"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ToolbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  tooltip?: string;
  icon?: ReactNode;
  children?: ReactNode;
}

export function ToolbarButton({
  isActive,
  tooltip,
  icon,
  children,
  className,
  disabled,
  ...props
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={tooltip}
      aria-label={tooltip}
      aria-pressed={isActive}
      disabled={disabled}
      className={cn(
        "inline-flex h-8 min-w-8 items-center justify-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-40",
        isActive
          ? "bg-primary/15 text-primary font-semibold"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
