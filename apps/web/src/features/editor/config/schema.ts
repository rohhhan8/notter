export const CONTROLLED_NODE_TYPES = [
  "doc",
  "paragraph",
  "heading",
  "bulletList",
  "orderedList",
  "listItem",
  "taskList",
  "taskItem",
  "blockquote",
  "codeBlock",
  "horizontalRule",
  "hardBreak",
  "table",
  "tableRow",
  "tableHeader",
  "tableCell",
  "callout",
] as const;

export type ControlledNodeType = (typeof CONTROLLED_NODE_TYPES)[number];

export const CONTROLLED_MARK_TYPES = [
  "bold",
  "italic",
  "code",
  "highlight",
  "link",
  "strike",
] as const;

export type ControlledMarkType = (typeof CONTROLLED_MARK_TYPES)[number];
