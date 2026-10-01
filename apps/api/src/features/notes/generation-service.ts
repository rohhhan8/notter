import type { GenerateNoteRequest, Note, NoteMode, UserPlan } from "@notter/types";
import { resolveUserPlan } from "./domain/plan-resolver";
import { validateGenerateInput } from "./domain/validator";
import { getEffectiveLimits } from "./domain/limit-calculator";
import { buildNotePrompt } from "./prompts/builder";
import { groqProvider } from "./providers/groq";
import { validateAndSanitizeNoteOutput } from "./schema/tiptap-schema";
import { createNote } from "./crud-service";

export interface GenerateStructuredNoteResult {
  note: Note;
  plan: UserPlan;
  mode: NoteMode;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    durationMs?: number;
    model?: string;
  };
}

export async function generateStructuredNote(
  payload: GenerateNoteRequest
): Promise<GenerateStructuredNoteResult> {
  // 1. Resolve user & plan
  const { plan } = await resolveUserPlan();

  // 2. Validate input and mode against plan limits
  const validation = validateGenerateInput(payload.prompt, payload.mode, plan);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const { prompt, mode } = validation;

  // 3. Compute effective token limit and density
  const limits = getEffectiveLimits(plan, mode);

  // 4. Build modular system & user prompts
  const { systemPrompt, userPrompt } = buildNotePrompt({
    prompt,
    mode,
    effectiveMaxOutputTokens: limits.effectiveMaxOutputTokens,
    density: limits.density,
    intent: payload.intent,
  });

  // 5. Invoke LLM provider
  const completion = await groqProvider.completeJson({
    systemPrompt,
    userPrompt,
    maxTokens: limits.effectiveMaxOutputTokens,
  });

  // 6. Validate and sanitize Tiptap JSON schema
  const sanitizedOutput = validateAndSanitizeNoteOutput(completion.parsedJson);

  // 7. Persist to database
  const createdNote = await createNote({
    title: sanitizedOutput.title,
    document: sanitizedOutput.document as unknown as Record<string, unknown>,
    mode,
  });

  return {
    note: createdNote,
    plan,
    mode,
    usage: completion.usage,
  };
}
