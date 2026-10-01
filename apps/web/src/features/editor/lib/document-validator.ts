import type { JSONContent } from "@tiptap/core";
import { CONTROLLED_NODE_TYPES, CONTROLLED_MARK_TYPES, type ControlledNodeType } from "../config/schema";

const VALID_NODES = new Set<string>(CONTROLLED_NODE_TYPES);
const VALID_MARKS = new Set<string>(CONTROLLED_MARK_TYPES);

/**
 * Validates and safely normalizes a Tiptap document tree against the controlled schema.
 * Replaces unknown block nodes with valid paragraphs to ensure Tiptap never crashes.
 */
export function sanitizeDocument(doc: JSONContent | null | undefined): JSONContent {
  if (!doc || typeof doc !== "object") {
    return {
      type: "doc",
      content: [{ type: "paragraph" }],
    };
  }

  function sanitizeNode(node: JSONContent): JSONContent {
    if (!node || typeof node !== "object") {
      return { type: "paragraph", content: [{ type: "text", text: "" }] };
    }

    const type = node.type || "paragraph";
    const isKnownNode = VALID_NODES.has(type);

    if (!isKnownNode && process.env.NODE_ENV !== "production") {
      console.warn(`[Noter Editor] Unsupported node type "${type}" detected. Falling back to paragraph.`);
    }

    const safeType: ControlledNodeType = isKnownNode ? (type as ControlledNodeType) : "paragraph";

    const sanitized: JSONContent = {
      type: safeType,
    };

    if (node.text !== undefined) {
      sanitized.text = String(node.text);
    }

    if (node.attrs && typeof node.attrs === "object") {
      sanitized.attrs = { ...node.attrs };
    }

    if (Array.isArray(node.marks)) {
      sanitized.marks = node.marks
        .filter((mark) => {
          const isValid = mark && mark.type && VALID_MARKS.has(mark.type);
          if (!isValid && process.env.NODE_ENV !== "production") {
            console.warn(`[Noter Editor] Filtered unsupported mark: ${mark?.type}`);
          }
          return isValid;
        })
        .map((mark) => ({
          type: mark.type,
          ...(mark.attrs ? { attrs: { ...mark.attrs } } : {}),
        }));
    }

    if (Array.isArray(node.content)) {
      sanitized.content = node.content.map(sanitizeNode);
    }

    return sanitized;
  }

  const root = sanitizeNode(doc);
  if (root.type !== "doc") {
    return {
      type: "doc",
      content: [root],
    };
  }

  if (!root.content || root.content.length === 0) {
    root.content = [{ type: "paragraph" }];
  }

  return root;
}
