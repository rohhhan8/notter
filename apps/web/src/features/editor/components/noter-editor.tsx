"use client";

import { useState, useMemo, useCallback } from "react";
import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import { createEditorExtensions } from "../extensions";
import { EditorToolbar } from "./editor-toolbar";
import { areDocumentsEqual } from "../lib/document-equality";
import { sanitizeDocument } from "../lib/document-validator";
import { HARDCODED_TEST_DOCUMENT } from "../data/hardcoded-test-document";
import { cn } from "@/lib/utils";

export interface NoterEditorProps {
  initialDocument?: JSONContent;
  onSave?: (document: JSONContent) => void;
  className?: string;
  title?: string;
  mode?: string;
}

export function NoterEditor({
  initialDocument = HARDCODED_TEST_DOCUMENT,
  onSave,
  className,
  title,
  mode,
}: NoterEditorProps) {
  // Ensure the document is validated against the controlled schema
  const validatedInitial = useMemo(() => sanitizeDocument(initialDocument), [initialDocument]);

  // Baseline saved document snapshot for dirty state comparison
  const [savedDocument, setSavedDocument] = useState<JSONContent>(() => validatedInitial);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  // Stable extension configuration
  const extensions = useMemo(() => createEditorExtensions(), []);

  const handleUpdate = useCallback(
    ({ editor }: { editor: { getJSON: () => JSONContent } }) => {
      const current = editor.getJSON();
      const equal = areDocumentsEqual(current, savedDocument);
      setIsDirty(!equal);
    },
    [savedDocument],
  );

  const editor = useEditor({
    extensions,
    content: validatedInitial,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-neutral dark:prose-invert max-w-none focus:outline-none min-h-[320px] px-6 py-6 text-[0.95rem] leading-7",
          "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:mt-6 [&_h1]:mb-3 [&_h1]:text-foreground",
          "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:mt-6 [&_h2]:mb-2.5 [&_h2]:text-foreground",
          "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-foreground",
          "[&_p]:my-2.5 [&_p]:leading-7",
          "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2.5",
          "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2.5",
          "[&_li]:my-0.5",
          "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_code]:text-foreground",
          "[&_pre]:my-4 [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-border/70 [&_pre]:bg-neutral-900 [&_pre]:p-4 [&_pre]:text-neutral-100",
          "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-xs",
        ),
      },
    },
    onUpdate: handleUpdate,
  });

  const handleSave = useCallback(() => {
    if (!editor) return;
    const currentJson = editor.getJSON();

    // Log / store temporarily as specified in Phase 1
    if (process.env.NODE_ENV !== "production") {
      console.log("[Noter Editor] Document Saved Successfully. Canonical JSON:", currentJson);
    }

    setSavedDocument(currentJson);
    setIsDirty(false);
    onSave?.(currentJson);
  }, [editor, onSave]);

  return (
    <div
      className={cn(
        "relative flex flex-col w-full rounded-2xl border border-border bg-card shadow-xs overflow-hidden",
        className,
      )}
    >
      {/* Editor Toolbar with Active State and Save Button */}
      <EditorToolbar editor={editor} isDirty={isDirty} onSave={handleSave} />

      {/* Note Header / Meta display */}
      {(title || mode) && (
        <div className="border-b border-border/40 px-6 pt-5 pb-3">
          <div className="flex items-center gap-2 mb-1.5">
            {mode && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-primary">
                /{mode}
              </span>
            )}
            <span className="text-[11px] text-muted-foreground font-mono">Tiptap Rich-Text Mode</span>
          </div>
          {title && (
            <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
          )}
        </div>
      )}

      {/* Editable Tiptap Document Surface */}
      <div className="flex-1 overflow-y-auto bg-card cursor-text" onClick={() => editor?.commands.focus()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
