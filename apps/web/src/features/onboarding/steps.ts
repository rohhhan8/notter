export type OnboardingStep = "welcome" | "sign-up" | "sign-in" | "profile" | "welcome-back";

export const stepHref: Record<OnboardingStep, string> = {
  welcome: "/onboarding",
  "sign-up": "/onboarding/sign-up",
  "sign-in": "/onboarding/sign-in",
  profile: "/onboarding/profile",
  "welcome-back": "/onboarding/welcome-back",
};

const hrefToStep: Record<string, OnboardingStep> = {
  "/onboarding": "welcome",
  "/onboarding/sign-up": "sign-up",
  "/onboarding/sign-in": "sign-in",
  "/onboarding/profile": "profile",
  "/onboarding/welcome-back": "welcome-back",
};

export function getStepFromPathname(pathname: string): OnboardingStep {
  return hrefToStep[pathname] ?? "welcome";
}

/** 1-indexed position in the stepper. Steps not listed (welcome, welcome-back) don't show one. */
export const stepperPosition: Partial<Record<OnboardingStep, 1 | 2>> = {
  "sign-up": 1,
  "sign-in": 1,
  profile: 2,
};

export const stepperTotal = Math.max(...Object.values(stepperPosition));
