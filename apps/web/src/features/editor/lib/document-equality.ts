import fastDeepEqual from "fast-deep-equal";
import type { JSONContent } from "@tiptap/core";

/**
 * Normalizes a Tiptap JSON document by removing transient or empty properties
 * so comparison is strictly semantic.
 */
export function normalizeDocument(doc: JSONContent | null | undefined): JSONContent | null {
  if (!doc) return null;

  // Clean recursion through content array
  const cleanNode = (node: JSONContent): JSONContent => {
    const cleaned: JSONContent = { type: node.type };

    if (node.text !== undefined) {
      cleaned.text = node.text;
    }

    if (node.attrs && Object.keys(node.attrs).length > 0) {
      cleaned.attrs = { ...node.attrs };
    }

    if (node.marks && node.marks.length > 0) {
      cleaned.marks = node.marks.map((m) => ({
        type: m.type,
        ...(m.attrs && Object.keys(m.attrs).length > 0 ? { attrs: { ...m.attrs } } : {}),
      }));
    }

    if (node.content && node.content.length > 0) {
      cleaned.content = node.content.map(cleanNode);
    }

    return cleaned;
  };

  return cleanNode(doc);
}

/**
 * Compares two Tiptap JSON documents for deep semantic equality.
 */
export function areDocumentsEqual(
  docA: JSONContent | null | undefined,
  docB: JSONContent | null | undefined,
): boolean {
  if (docA === docB) return true;
  if (!docA || !docB) return false;

  const normA = normalizeDocument(docA);
  const normB = normalizeDocument(docB);

  return fastDeepEqual(normA, normB);
}
