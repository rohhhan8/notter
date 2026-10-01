import type { NoteMode } from "@notter/types";
import { BASE_INSTRUCTIONS } from "./base-instructions";
import { OUTPUT_SCHEMA_INSTRUCTIONS } from "./output-schema";
import { formatGenerationConstraints } from "./generation-constraints";
import { getModeContract } from "./modes";
import type { NoteDensity } from "../config/modes";

export interface PromptBuildParams {
  prompt: string;
  mode: NoteMode;
  effectiveMaxOutputTokens: number;
  density: NoteDensity;
  intent?: string;
}

export interface BuiltPrompt {
  systemPrompt: string;
  userPrompt: string;
}

/**
 * Assembles the system and user prompts in an optimal order for LLM prompt caching.
 * Stable system tokens (Base Instructions, Mode Contract, Schema, Constraints) are separated
 * from volatile user input tokens.
 */
export function buildNotePrompt({
  prompt,
  mode,
  effectiveMaxOutputTokens,
  density,
  intent,
}: PromptBuildParams): BuiltPrompt {
  const modeContract = getModeContract(mode);
  const constraints = formatGenerationConstraints(effectiveMaxOutputTokens, density);

  const systemPrompt = [
    BASE_INSTRUCTIONS,
    "--------------------------------------------------",
    modeContract,
    "--------------------------------------------------",
    OUTPUT_SCHEMA_INSTRUCTIONS,
    "--------------------------------------------------",
    constraints,
  ].join("\n\n");

  const userParts: string[] = [];

  if (intent && intent.trim()) {
    userParts.push(`USER INTENT / CONTEXT:\n${intent.trim()}`);
  }

  userParts.push(`<<<USER_NOTE_INPUT>>>\n${prompt.trim()}\n<<<END_USER_NOTE_INPUT>>>`);
  userParts.push("Remember: Output ONLY the strict JSON object with 'title' and 'document'.");

  const userPrompt = userParts.join("\n\n");

  return {
    systemPrompt,
    userPrompt,
  };
}
