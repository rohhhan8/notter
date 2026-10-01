"use client";

import { useState, useRef, useEffect } from "react";
import type { Editor } from "@tiptap/react";
import { Table as TableIcon, ChevronDown, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TableToolbarMenuProps {
  editor: Editor;
}

export function TableToolbarMenu({ editor }: TableToolbarMenuProps) {
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

  const isTableActive = editor.isActive("table");

  function insertTable() {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs font-medium transition-colors cursor-pointer",
          isTableActive
            ? "bg-primary/15 text-primary font-semibold"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
        aria-label="Table options"
        title="Table"
      >
        <TableIcon className="size-3.5" />
        <span className="hidden sm:inline">Table</span>
        <ChevronDown className="size-3 opacity-60" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 rounded-lg border border-border bg-card p-1 shadow-lg z-50 animate-in fade-in duration-100 text-xs">
          {!isTableActive ? (
            <button
              type="button"
              onClick={insertTable}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-foreground hover:bg-muted cursor-pointer"
            >
              <Plus className="size-3.5 text-primary" />
              <span>Insert Table (3×3)</span>
            </button>
          ) : (
            <>
              <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Rows & Columns
              </div>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().addRowAfter().run();
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-1 text-left text-foreground hover:bg-muted cursor-pointer"
              >
                <Plus className="size-3 text-muted-foreground" />
                <span>Add Row Below</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().deleteRow().run();
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-1 text-left text-foreground hover:bg-muted cursor-pointer"
              >
                <Trash2 className="size-3 text-muted-foreground" />
                <span>Delete Row</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().addColumnAfter().run();
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-1 text-left text-foreground hover:bg-muted cursor-pointer"
              >
                <Plus className="size-3 text-muted-foreground" />
                <span>Add Column Right</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().deleteColumn().run();
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-1 text-left text-foreground hover:bg-muted cursor-pointer"
              >
                <Trash2 className="size-3 text-muted-foreground" />
                <span>Delete Column</span>
              </button>

              <div className="h-px bg-border/60 my-1" />

              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().toggleHeaderRow().run();
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-1 text-left text-foreground hover:bg-muted cursor-pointer"
              >
                <span>Toggle Header Row</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().deleteTable().run();
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-1 text-left text-destructive hover:bg-destructive/10 cursor-pointer"
              >
                <Trash2 className="size-3" />
                <span>Delete Table</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
