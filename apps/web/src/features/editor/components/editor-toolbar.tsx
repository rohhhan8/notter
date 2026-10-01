"use client";

import { useState, useEffect } from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  FileCode,
  Minus,
  Undo2,
  Redo2,
} from "lucide-react";
import { ToolbarButton } from "./toolbar-button";
import { HeadingSelector } from "./heading-selector";
import { HighlightPopover } from "./highlight-popover";
import { LinkDialog } from "./link-dialog";
import { CalloutSelector } from "./callout-selector";
import { TableToolbarMenu } from "./table-toolbar-menu";
import { SaveButton } from "./save-button";

interface EditorToolbarProps {
  editor: Editor | null;
  isDirty: boolean;
  onSave: () => void;
}

export function EditorToolbar({ editor, isDirty, onSave }: EditorToolbarProps) {
  // Sync state on cursor movement and text selection
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const handleSync = () => {
      setTick((prev) => prev + 1);
    };

    editor.on("selectionUpdate", handleSync);
    editor.on("transaction", handleSync);

    return () => {
      editor.off("selectionUpdate", handleSync);
      editor.off("transaction", handleSync);
    };
  }, [editor]);

  if (!editor) return null;

  return (
    <div
      role="toolbar"
      aria-label="Editor toolbar"
      className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-1.5 border-b border-border/80 bg-card/95 px-3 py-2 backdrop-blur-md"
    >
      <div className="flex flex-wrap items-center gap-1">
        {/* Undo / Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          tooltip="Undo (⌘Z)"
          icon={<Undo2 className="size-3.5" />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          tooltip="Redo (⌘⇧Z)"
          icon={<Redo2 className="size-3.5" />}
        />

        <div className="h-4 w-px bg-border/60 mx-1 hidden sm:block" />

        {/* Heading Hierarchy Selector */}
        <HeadingSelector editor={editor} />

        <div className="h-4 w-px bg-border/60 mx-1 hidden sm:block" />

        {/* Inline Marks */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          tooltip="Bold (⌘B)"
          icon={<Bold className="size-3.5" />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          tooltip="Italic (⌘I)"
          icon={<Italic className="size-3.5" />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          tooltip="Strikethrough"
          icon={<Strikethrough className="size-3.5" />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          tooltip="Inline Code"
          icon={<Code className="size-3.5" />}
        />

        {/* 4-Color Highlight Popover */}
        <HighlightPopover editor={editor} />

        {/* Hyperlink Dialog */}
        <LinkDialog editor={editor} />

        <div className="h-4 w-px bg-border/60 mx-1 hidden sm:block" />

        {/* Lists & Tasks */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          tooltip="Bullet List"
          icon={<List className="size-3.5" />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          tooltip="Numbered List"
          icon={<ListOrdered className="size-3.5" />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          isActive={editor.isActive("taskList")}
          tooltip="Task List"
          icon={<CheckSquare className="size-3.5" />}
        />

        <div className="h-4 w-px bg-border/60 mx-1 hidden sm:block" />

        {/* Blocks & Rich Elements */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          tooltip="Blockquote"
          icon={<Quote className="size-3.5" />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          tooltip="Code Block"
          icon={<FileCode className="size-3.5" />}
        />

        {/* Callout Selector (Takeaway, Info, Important, Warning) */}
        <CalloutSelector editor={editor} />

        {/* Table Operations Menu */}
        <TableToolbarMenu editor={editor} />

        {/* Horizontal Divider */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          tooltip="Horizontal Divider"
          icon={<Minus className="size-3.5" />}
        />
      </div>

      {/* Save Action with Dirty State Indicator */}
      <div className="ml-auto pl-2">
        <SaveButton isDirty={isDirty} onSave={onSave} />
      </div>
    </div>
  );
}
