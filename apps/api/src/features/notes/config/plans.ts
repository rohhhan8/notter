import type { UserPlan, PlanLimits } from "@notter/types";

export const PLAN_LIMITS: Record<UserPlan, PlanLimits> = {
  free: {
    maxInputCharacters: 2000,
    maxOutputTokens: 800,
  },
  pro: {
    maxInputCharacters: 20000,
    maxOutputTokens: 8000,
  },
};
