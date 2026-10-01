import assert from "node:assert";
import { getEffectiveLimits } from "../domain/limit-calculator";
import { validateGenerateInput } from "../domain/validator";
import { buildNotePrompt } from "../prompts/builder";
import {
  validateAndSanitizeNoteOutput,
  generatedNoteSchema,
} from "../schema/tiptap-schema";

console.log("=== Starting LLM Generation Pipeline Automated Tests ===");

// 1. Test Limit Calculator
console.log("\n[Test 1] Limit Calculator & Ceilings:");
{
  // Pro on general: ceiling is mode limit (600), not plan limit (8000)
  const proGeneral = getEffectiveLimits("pro", "general");
  assert.strictEqual(proGeneral.effectiveMaxOutputTokens, 600);
  assert.strictEqual(proGeneral.density, "concise");
  console.log("  ✓ Pro on general correctly caps at 600 tokens (concise)");

  // Free on research: ceiling is plan limit (800), not mode limit (4000)
  const freeResearch = getEffectiveLimits("free", "research");
  assert.strictEqual(freeResearch.effectiveMaxOutputTokens, 800);
  assert.strictEqual(freeResearch.density, "very-detailed");
  console.log("  ✓ Free on research correctly caps at 800 tokens");

  // Pro on research: ceiling is mode limit (4000)
  const proResearch = getEffectiveLimits("pro", "research");
  assert.strictEqual(proResearch.effectiveMaxOutputTokens, 4000);
  console.log("  ✓ Pro on research unlocks 4000 tokens (very-detailed)");

  // Pro on technical: 2500 tokens
  const proTechnical = getEffectiveLimits("pro", "technical");
  assert.strictEqual(proTechnical.effectiveMaxOutputTokens, 2500);
  assert.strictEqual(proTechnical.density, "detailed");
  console.log("  ✓ Pro on technical correctly caps at 2500 tokens");
}

// 2. Test Input & Mode Validation
console.log("\n[Test 2] Domain Input & Mode Validation:");
{
  // Empty input
  const emptyRes = validateGenerateInput("   ", "general", "free");
  assert.strictEqual(emptyRes.isValid, false);
  if (!emptyRes.isValid) {
    assert.strictEqual(emptyRes.code, "EMPTY_INPUT");
  }
  console.log("  ✓ Empty / whitespace input correctly rejected");

  // Unsupported mode
  const badModeRes = validateGenerateInput("Hello world", "invalid-mode", "free");
  assert.strictEqual(badModeRes.isValid, false);
  if (!badModeRes.isValid) {
    assert.strictEqual(badModeRes.code, "UNSUPPORTED_MODE");
  }
  console.log("  ✓ Unsupported mode rejected");

  // Input too long for Free user (>2000 chars)
  const longInput = "a".repeat(2001);
  const freeLongRes = validateGenerateInput(longInput, "general", "free");
  assert.strictEqual(freeLongRes.isValid, false);
  if (!freeLongRes.isValid) {
    assert.strictEqual(freeLongRes.code, "INPUT_TOO_LONG");
  }
  console.log("  ✓ Input exceeding Free plan (2000 chars) rejected");

  // Input allowed for Pro user (e.g. 5000 chars)
  const proLongInput = "a".repeat(5000);
  const proLongRes = validateGenerateInput(proLongInput, "general", "pro");
  assert.strictEqual(proLongRes.isValid, true);
  console.log("  ✓ Input of 5000 chars accepted for Pro plan");
}

// 3. Test Modular Prompt Builder Order & Prompt Caching
console.log("\n[Test 3] Modular Prompt Assembly & Caching Order:");
{
  const built = buildNotePrompt({
    prompt: "Key findings from clinical trial Phase 2",
    mode: "research",
    effectiveMaxOutputTokens: 4000,
    density: "very-detailed",
    intent: "Medical research thesis",
  });

  // Verify caching order: Base -> Mode Contract -> Output Schema -> Constraints
  const baseIdx = built.systemPrompt.indexOf("You are Noter, an expert AI note-taking assistant");
  const modeIdx = built.systemPrompt.indexOf("MODE CONTRACT: RESEARCH");
  const schemaIdx = built.systemPrompt.indexOf("OUTPUT SCHEMA CONTRACT");
  const constraintsIdx = built.systemPrompt.indexOf("OUTPUT CONSTRAINTS & DENSITY SPECIFICATION");

  assert(baseIdx !== -1, "Base instructions missing");
  assert(modeIdx !== -1, "Mode contract missing");
  assert(schemaIdx !== -1, "Output schema instructions missing");
  assert(constraintsIdx !== -1, "Generation constraints missing");

  assert(baseIdx < modeIdx, "Base instructions must precede Mode contract");
  assert(modeIdx < schemaIdx, "Mode contract must precede Output schema");
  assert(schemaIdx < constraintsIdx, "Output schema must precede Constraints");

  // Check user prompt delimiters
  assert(built.userPrompt.includes("<<<USER_NOTE_INPUT>>>"));
  assert(built.userPrompt.includes("<<<END_USER_NOTE_INPUT>>>"));
  assert(built.userPrompt.includes("USER INTENT / CONTEXT:"));
  console.log("  ✓ Modular prompt assembled in exact prompt-caching hierarchy");
}

// 4. Test Tiptap Zod Schema & Sanitizer
console.log("\n[Test 4] Tiptap Zod Schema & Node Validation:");
{
  const validDoc = {
    title: "Quarterly Strategy Review",
    document: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "Quarterly Strategy Review" }],
        },
        {
          type: "callout",
          attrs: { type: "takeaway" },
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Core takeaway: Ship early, listen to users.",
                  marks: [{ type: "bold" }],
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
              attrs: { checked: false },
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Deploy API migrations" }],
                },
              ],
            },
          ],
        },
      ],
    },
  };

  const parsed = generatedNoteSchema.safeParse(validDoc);
  assert.strictEqual(parsed.success, true);
  console.log("  ✓ Valid Tiptap document passes strict Zod validation");

  // Test sanitizer fallback
  const malformedInput = "Just raw text from an unexpected LLM glitch";
  const sanitized = validateAndSanitizeNoteOutput(malformedInput);
  assert.strictEqual(sanitized.document.type, "doc");
  assert(Array.isArray(sanitized.document.content));
  assert.strictEqual(sanitized.document.content[0].type, "paragraph");
  console.log("  ✓ Sanitizer safely normalizes unstructured fallbacks to valid doc");
}

console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY! 🎉\n");
