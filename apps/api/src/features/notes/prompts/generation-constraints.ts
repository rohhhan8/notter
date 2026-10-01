import type { NoteDensity } from "../config/modes";

export function formatGenerationConstraints(maxOutputTokens: number, density: NoteDensity): string {
  return `OUTPUT CONSTRAINTS & DENSITY SPECIFICATION:
- Maximum Output Budget: up to ${maxOutputTokens} tokens.
- Target Information Density: "${density}".

NON-PADDING DIRECTIVE:
- This maximum output budget is a hard CEILING, NOT a target.
- You must generate ONLY as much content as the source material warrants.
- If the user provides a 2-sentence note, generate a concise, focused note (do NOT inflate it with synthetic bullet points or repetitive boilerplate).
- If the source is comprehensive and detailed, you may use the appropriate depth up to the ceiling.
- Avoid repetitive intros, meta-commentary (e.g. "Here are your notes:"), or unnecessary fluff.`;
}
