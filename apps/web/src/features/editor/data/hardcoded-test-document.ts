import type { JSONContent } from "@tiptap/core";

export const HARDCODED_TEST_DOCUMENT: JSONContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "React 19 & Next.js Architecture Notes" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "This document serves as a comprehensive test suite for Noter's editable rich-text engine. It verifies all supported block nodes, marks, and interactive elements.",
        },
      ],
    },
    {
      type: "callout",
      attrs: { variant: "takeaway" },
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              marks: [{ type: "bold" }],
              text: "Key Takeaway: ",
            },
            {
              type: "text",
              text: "Always maintain structured JSON as canonical source of truth for reliable persistence and safe LLM ingestion without raw HTML injection.",
            },
          ],
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Text Formatting & Highlights" }],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "Standard text can be styled with " },
        { type: "text", marks: [{ type: "bold" }], text: "bold" },
        { type: "text", text: ", " },
        { type: "text", marks: [{ type: "italic" }], text: "italic" },
        { type: "text", text: ", " },
        { type: "text", marks: [{ type: "strike" }], text: "strikethrough" },
        { type: "text", text: ", and " },
        { type: "text", marks: [{ type: "code" }], text: "inline code" },
        { type: "text", text: ". Hyperlinks like " },
        {
          type: "text",
          marks: [{ type: "link", attrs: { href: "https://tiptap.dev" } }],
          text: "Tiptap Documentation",
        },
        { type: "text", text: " open securely in a new tab." },
      ],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "The editor provides 4 curated highlight shades: " },
        {
          type: "text",
          marks: [{ type: "highlight", attrs: { color: "#fef08a" } }],
          text: "amber-yellow for general review",
        },
        { type: "text", text: ", " },
        {
          type: "text",
          marks: [{ type: "highlight", attrs: { color: "#bbf7d0" } }],
          text: "mint-green for verified items",
        },
        { type: "text", text: ", " },
        {
          type: "text",
          marks: [{ type: "highlight", attrs: { color: "#fed7aa" } }],
          text: "coral-orange for attention items",
        },
        { type: "text", text: ", and " },
        {
          type: "text",
          marks: [{ type: "highlight", attrs: { color: "#bfdbfe" } }],
          text: "sky-blue for deep references",
        },
        { type: "text", text: "." },
      ],
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Lists & Interactive Checklists" }],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Unordered bullet item level 1" }],
            },
            {
              type: "bulletList",
              content: [
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: "Nested bullet item level 2" }],
                    },
                  ],
                },
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: "Another nested bullet item" }],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Second top-level bullet point" }],
            },
          ],
        },
      ],
    },
    {
      type: "orderedList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "First ordered procedure step" }],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Second ordered procedure step" }],
            },
          ],
        },
      ],
    },
    {
      type: "taskList",
      content: [
        {
          type: "taskItem",
          attrs: { checked: true },
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Completed task item: Verify Tiptap schema configuration" }],
            },
          ],
        },
        {
          type: "taskItem",
          attrs: { checked: false },
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Pending task item: Test interactive checkbox toggling" }],
            },
          ],
        },
        {
          type: "taskItem",
          attrs: { checked: false },
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Pending task item: Validate dirty state tracking" }],
            },
          ],
        },
      ],
    },
    {
      type: "blockquote",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "“Good architecture is about making decisions easy to change later, while ensuring the current abstractions are rock solid.”",
            },
          ],
        },
      ],
    },
    {
      type: "callout",
      attrs: { variant: "info" },
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Note: Lowlight syntax highlighting runs client-side with highlight.js grammars and does not execute untrusted scripts.",
            },
          ],
        },
      ],
    },
    {
      type: "callout",
      attrs: { variant: "warning" },
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Warning: Direct HTML manipulation bypasses ProseMirror's transaction pipeline and must never be permitted in persistent flows.",
            },
          ],
        },
      ],
    },
    {
      type: "codeBlock",
      attrs: { language: "javascript" },
      content: [
        {
          type: "text",
          text: `// Syntax-highlighted code block with preserved indentation\nfunction calculateChecksum(payload) {\n  const normalized = JSON.stringify(payload);\n  let hash = 0;\n  for (let i = 0; i < normalized.length; i++) {\n    hash = (hash << 5) - hash + normalized.charCodeAt(i);\n    hash |= 0;\n  }\n  return hash;\n}`,
        },
      ],
    },
    {
      type: "horizontalRule",
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Structured Data Table" }],
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableHeader",
              content: [{ type: "paragraph", content: [{ type: "text", text: "Node Name" }] }],
            },
            {
              type: "tableHeader",
              content: [{ type: "paragraph", content: [{ type: "text", text: "Category" }] }],
            },
            {
              type: "tableHeader",
              content: [{ type: "paragraph", content: [{ type: "text", text: "Status" }] }],
            },
          ],
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "paragraph", content: [{ type: "text", text: "callout" }] }],
            },
            {
              type: "tableCell",
              content: [{ type: "paragraph", content: [{ type: "text", text: "Custom Node" }] }],
            },
            {
              type: "tableCell",
              content: [{ type: "paragraph", content: [{ type: "text", text: "Active" }] }],
            },
          ],
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "paragraph", content: [{ type: "text", text: "codeBlockLowlight" }] }],
            },
            {
              type: "tableCell",
              content: [{ type: "paragraph", content: [{ type: "text", text: "Syntax Block" }] }],
            },
            {
              type: "tableCell",
              content: [{ type: "paragraph", content: [{ type: "text", text: "Active" }] }],
            },
          ],
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "paragraph", content: [{ type: "text", text: "taskList" }] }],
            },
            {
              type: "tableCell",
              content: [{ type: "paragraph", content: [{ type: "text", text: "Interactive" }] }],
            },
            {
              type: "tableCell",
              content: [{ type: "paragraph", content: [{ type: "text", text: "Active" }] }],
            },
          ],
        },
      ],
    },
  ],
};
