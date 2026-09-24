"use client";

import { createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnboardingStepper } from "@/features/onboarding/components/onboarding-stepper";
import { WelcomeScreen } from "@/features/onboarding/components/welcome-screen";
import { SignUpForm } from "@/features/onboarding/components/sign-up-form";
import { SignInForm } from "@/features/onboarding/components/sign-in-form";
import { ProfileForm } from "@/features/onboarding/components/profile-form";
import { WelcomeBackScreen } from "@/features/onboarding/components/welcome-back-screen";
import {
  stepHref,
  stepperPosition,
  backStep,
  getStepFromPathname,
  type OnboardingStep,
} from "@/features/onboarding/steps";

const titles: Partial<Record<OnboardingStep, { title: string; subtitle?: string }>> = {
  "sign-up": { title: "Create your account", subtitle: "Takes less than a minute." },
  "sign-in": { title: "Welcome back", subtitle: "Sign in to pick up where you left off." },
  profile: { title: "Set up your profile", subtitle: "This helps us tailor Notter to you." },
};

/** Navigate to another onboarding step by name. See OnboardingFlow for why this is a plain router.push. */
export const OnboardingNavigationContext = createContext<(step: OnboardingStep) => void>(() => {});

export function useOnboardingNavigate() {
  return useContext(OnboardingNavigationContext);
}

/**
 * Mounted once by app/onboarding/layout.tsx — a layout persists across
 * nested route changes in the App Router, so this component instance (and
 * everything inside it: the back button, the stepper, the header) never
 * unmounts as the user moves between onboarding steps. It reads the current
 * step from the URL itself (usePathname), rather than each route's page.tsx
 * passing it down, specifically so the layout doesn't need `children` (whose
 * identity swaps on every navigation) in the persistent part of the tree at
 * all. Route pages under app/onboarding/* exist only so the URL, browser
 * back/forward, and proxy.ts route protection keep working — their own
 * content is unused, StepContent below is a plain switch on the step name.
 */
export function OnboardingFlow() {
  const pathname = usePathname();
  const router = useRouter();
  const step = getStepFromPathname(pathname);

  function goToStep(target: OnboardingStep) {
    router.push(stepHref[target]);
  }

  const chrome = titles[step];
  const position = stepperPosition[step];
  const back = backStep[step];

  return (
    <OnboardingNavigationContext.Provider value={goToStep}>
      <div className="flex flex-col gap-6 pb-8 empty:pb-0">
        {chrome ? (
          <>
            {back ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Go back"
                onClick={() => goToStep(back)}
                className="-ml-2 size-9 transition-transform duration-100 ease-out active:scale-[0.94]"
              >
                <ArrowLeft className="size-4" />
              </Button>
            ) : null}
            {position ? <OnboardingStepper current={position} /> : null}
            <div className="flex flex-col gap-2">
              <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance">{chrome.title}</h1>
              {chrome.subtitle ? (
                <p className="text-base text-muted-foreground text-pretty">{chrome.subtitle}</p>
              ) : null}
            </div>
          </>
        ) : null}
      </div>

      <StepContent step={step} />
    </OnboardingNavigationContext.Provider>
  );
}

function StepContent({ step }: { step: OnboardingStep }) {
  return (
    <div key={step} className="flex flex-1 flex-col animate-in fade-in duration-200 ease-out">
      {step === "welcome" && <WelcomeScreen />}
      {step === "sign-up" && <SignUpForm />}
      {step === "sign-in" && <SignInForm />}
      {step === "profile" && <ProfileForm />}
      {step === "welcome-back" && <WelcomeBackScreen />}
    </div>
  );
}
