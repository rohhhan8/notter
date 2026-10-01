import type { NoteMode, UserPlan } from "@notter/types";
import { PLAN_LIMITS } from "../config/plans";
import { MODE_OUTPUT_CONFIG, type NoteDensity } from "../config/modes";

export interface EffectiveLimitResult {
  effectiveMaxOutputTokens: number;
  planMaxOutputTokens: number;
  modeMaxOutputTokens: number;
  density: NoteDensity;
}

/**
 * Calculates effective output token ceiling: MIN(plan limit, mode limit).
 * Note: These are hard ceilings, not targets. The model should only generate
 * as much content as the source requires.
 */
export function getEffectiveLimits(plan: UserPlan, mode: NoteMode): EffectiveLimitResult {
  const planConfig = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;
  const modeConfig = MODE_OUTPUT_CONFIG[mode] ?? MODE_OUTPUT_CONFIG.general;

  const effectiveMaxOutputTokens = Math.min(planConfig.maxOutputTokens, modeConfig.maxOutputTokens);

  return {
    effectiveMaxOutputTokens,
    planMaxOutputTokens: planConfig.maxOutputTokens,
    modeMaxOutputTokens: modeConfig.maxOutputTokens,
    density: modeConfig.density,
  };
}

export function getEffectiveMaxOutputTokens(plan: UserPlan, mode: NoteMode): number {
  return getEffectiveLimits(plan, mode).effectiveMaxOutputTokens;
}
