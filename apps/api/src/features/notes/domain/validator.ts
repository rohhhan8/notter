import type { NoteMode, UserPlan } from "@notter/types";
import { PLAN_LIMITS } from "../config/plans";
import { SUPPORTED_NOTE_MODES } from "../config/modes";

export interface ValidationSuccess {
  isValid: true;
  prompt: string;
  mode: NoteMode;
}

export interface ValidationFailure {
  isValid: false;
  code: "EMPTY_INPUT" | "INPUT_TOO_LONG" | "UNSUPPORTED_MODE";
  error: string;
}

export type ValidationResult = ValidationSuccess | ValidationFailure;

export function validateGenerateInput(
  rawPrompt: unknown,
  rawMode: unknown,
  plan: UserPlan
): ValidationResult {
  if (typeof rawPrompt !== "string" || !rawPrompt.trim()) {
    return {
      isValid: false,
      code: "EMPTY_INPUT",
      error: "Prompt cannot be empty.",
    };
  }

  const prompt = rawPrompt.trim();
  const planLimits = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;

  if (prompt.length > planLimits.maxInputCharacters) {
    return {
      isValid: false,
      code: "INPUT_TOO_LONG",
      error: `Input length (${prompt.length} characters) exceeds the maximum allowed for your ${plan} plan (${planLimits.maxInputCharacters} characters).`,
    };
  }

  const mode = (typeof rawMode === "string" ? rawMode.toLowerCase() : "general") as NoteMode;

  if (!SUPPORTED_NOTE_MODES.includes(mode)) {
    return {
      isValid: false,
      code: "UNSUPPORTED_MODE",
      error: `Unsupported note mode "${rawMode}". Supported modes are: ${SUPPORTED_NOTE_MODES.join(", ")}.`,
    };
  }

  return {
    isValid: true,
    prompt,
    mode,
  };
}
