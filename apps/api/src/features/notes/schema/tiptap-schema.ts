import { z } from "zod";

// --- Marks ---
export const markSchema = z.object({
  type: z.enum(["bold", "italic", "code", "strike", "highlight", "link"]),
  attrs: z
    .object({
      color: z.string().optional(),
      href: z.string().optional(),
      target: z.string().optional(),
    })
    .optional(),
});

// --- Text node ---
export const textNodeSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
  marks: z.array(markSchema).optional(),
});

// --- Inline nodes ---
export const inlineNodeSchema = z.union([textNodeSchema, z.record(z.string(), z.unknown())]);

// Forward declaration for recursive content
export type TiptapNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
};

// Base block node schema (recursive)
export const blockNodeSchema: z.ZodType<TiptapNode> = z.lazy(() =>
  z.object({
    type: z.string(),
    attrs: z.record(z.string(), z.unknown()).optional(),
    content: z.array(z.lazy(() => blockNodeSchema)).optional(),
    text: z.string().optional(),
    marks: z.array(markSchema).optional(),
  })
);

// Specific node schemas for strict validation
export const headingNodeSchema = z.object({
  type: z.literal("heading"),
  attrs: z.object({
    level: z.number().int().min(1).max(3),
  }),
  content: z.array(textNodeSchema).optional(),
});

export const paragraphNodeSchema = z.object({
  type: z.literal("paragraph"),
  content: z.array(textNodeSchema).optional(),
});

export const codeBlockNodeSchema = z.object({
  type: z.literal("codeBlock"),
  attrs: z
    .object({
      language: z.string().optional(),
    })
    .optional(),
  content: z.array(textNodeSchema).optional(),
});

export const calloutNodeSchema = z.object({
  type: z.literal("callout"),
  attrs: z.object({
    type: z.enum(["takeaway", "info", "important", "warning"]),
  }),
  content: z.array(blockNodeSchema).optional(),
});

export const taskItemNodeSchema = z.object({
  type: z.literal("taskItem"),
  attrs: z
    .object({
      checked: z.boolean().optional(),
    })
    .optional(),
  content: z.array(blockNodeSchema).optional(),
});

export const taskListNodeSchema = z.object({
  type: z.literal("taskList"),
  content: z.array(taskItemNodeSchema).optional(),
});

export const tiptapDocSchema = z.object({
  type: z.literal("doc"),
  content: z.array(blockNodeSchema),
});

export const generatedNoteSchema = z.object({
  title: z.string().min(1).max(150),
  document: tiptapDocSchema,
});

export type GeneratedNoteOutput = z.infer<typeof generatedNoteSchema>;

/**
 * Validates and sanitizes the JSON document returned by the LLM.
 * If there are minor structural irregularities, it ensures a valid Tiptap document
 * structure is returned so the frontend editor never crashes.
 */
export function validateAndSanitizeNoteOutput(raw: unknown): GeneratedNoteOutput {
  const result = generatedNoteSchema.safeParse(raw);
  if (result.success) {
    return result.data;
  }

  // Handle case where LLM returned document inside or without wrapper
  const obj = typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>) : {};
  const rawTitle = typeof obj.title === "string" && obj.title.trim() ? obj.title.trim() : "Untitled Note";

  let doc = obj.document as Record<string, unknown> | undefined;
  if (!doc || doc.type !== "doc" || !Array.isArray(doc.content)) {
    // If raw itself has type "doc"
    if (obj.type === "doc" && Array.isArray(obj.content)) {
      doc = obj;
    } else {
      // Fallback valid document with error note
      doc = {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: typeof raw === "string" ? raw : JSON.stringify(raw),
              },
            ],
          },
        ],
      };
    }
  }

  return {
    title: rawTitle,
    document: doc as z.infer<typeof tiptapDocSchema>,
  };
}
