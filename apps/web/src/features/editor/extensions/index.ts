import StarterKit from "@tiptap/starter-kit";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Highlight } from "@tiptap/extension-highlight";
import { Link } from "@tiptap/extension-link";
import { Callout } from "./callout-extension";
import { lowlight } from "../lib/lowlight";

export function createEditorExtensions() {
  return [
    StarterKit.configure({
      codeBlock: false,
      heading: {
        levels: [1, 2, 3],
      },
      horizontalRule: {
        HTMLAttributes: {
          class: "my-6 border-t border-border/80",
        },
      },
      blockquote: {
        HTMLAttributes: {
          class: "my-4 border-l-3 border-primary/70 bg-muted/30 px-4 py-2 italic text-muted-foreground rounded-r-md text-sm",
        },
      },
    }),
    CodeBlockLowlight.configure({
      lowlight,
      HTMLAttributes: {
        class: "my-4 rounded-xl border border-border/70 bg-neutral-900 text-neutral-100 p-4 font-mono text-xs overflow-x-auto",
      },
    }),
    TaskList.configure({
      HTMLAttributes: {
        class: "noter-task-list my-3 space-y-1.5 list-none pl-0",
      },
    }),
    TaskItem.configure({
      nested: true,
      HTMLAttributes: {
        class: "flex items-start gap-2.5 my-1 leading-6",
      },
    }),
    Table.configure({
      resizable: false,
      HTMLAttributes: {
        class: "noter-table my-4 w-full border-collapse overflow-hidden rounded-lg border border-border text-sm",
      },
    }),
    TableRow.configure({
      HTMLAttributes: {
        class: "border-b border-border/60 hover:bg-muted/20 transition-colors",
      },
    }),
    TableHeader.configure({
      HTMLAttributes: {
        class: "border-r border-border/60 bg-muted/60 px-3.5 py-2.5 text-left font-semibold text-foreground text-xs uppercase tracking-wider last:border-r-0",
      },
    }),
    TableCell.configure({
      HTMLAttributes: {
        class: "border-r border-border/60 px-3.5 py-2 text-foreground/90 last:border-r-0",
      },
    }),
    Highlight.configure({
      multicolor: true,
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      HTMLAttributes: {
        class: "text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors cursor-pointer",
        rel: "noopener noreferrer",
        target: "_blank",
      },
    }),
    Callout,
  ];
}
