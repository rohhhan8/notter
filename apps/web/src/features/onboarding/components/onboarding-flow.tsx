"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createOnboardingClient, createProfileClient } from "@notter/api-client";
import { getApiBaseUrl } from "@/lib/env";
import { OnboardingStepper } from "@/features/onboarding/components/onboarding-stepper";
import { WelcomeScreen } from "@/features/onboarding/components/welcome-screen";
import { SignUpForm } from "@/features/onboarding/components/sign-up-form";
import { SignInForm } from "@/features/onboarding/components/sign-in-form";
import { ProfileForm } from "@/features/onboarding/components/profile-form";
import { WelcomeBackScreen } from "@/features/onboarding/components/welcome-back-screen";
import { stepHref, stepperPosition, getStepFromPathname, type OnboardingStep } from "@/features/onboarding/steps";

const titles: Partial<Record<OnboardingStep, { title: string; subtitle?: string }>> = {
  "sign-up": { title: "Create your account", subtitle: "Takes less than a minute." },
  "sign-in": { title: "Welcome back", subtitle: "Sign in to pick up where you left off." },
  profile: { title: "Set up your profile", subtitle: "This helps us tailor Notter to you." },
};

/** Steps a signed-in user shouldn't sit on if already fully set up. */
const signedOutOnlySteps: OnboardingStep[] = ["welcome", "sign-up", "sign-in"];

/** Navigate to another onboarding step by name. */
export const OnboardingNavigationContext = createContext<(step: OnboardingStep) => void>(() => {});

export function useOnboardingNavigate() {
  return useContext(OnboardingNavigationContext);
}

export function OnboardingFlow() {
  const pathname = usePathname();
  const router = useRouter();
  const step = getStepFromPathname(pathname);
  const [isProfileAuthorized, setIsProfileAuthorized] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;

    async function checkAccess() {
      const onboardingClient = createOnboardingClient({ baseUrl: getApiBaseUrl() });
      const session = await onboardingClient.getSession();

      if (cancelled) return;

      if (step === "profile") {
        if (!session) {
          // Unauthenticated user trying to access profile setup -> redirect to sign-up
          router.replace("/onboarding/sign-up");
          return;
        }

        // Authenticated user: check if profile already exists
        const profileClient = createProfileClient({ baseUrl: getApiBaseUrl() });
        const profile = await profileClient.getCurrent();
        if (cancelled) return;

        if (profile) {
          // Already completed profile -> send to home
          router.replace("/home");
          return;
        }

        // Authenticated and needs profile setup
        setIsProfileAuthorized(true);
      } else if (signedOutOnlySteps.includes(step)) {
        if (session) {
          const profileClient = createProfileClient({ baseUrl: getApiBaseUrl() });
          const profile = await profileClient.getCurrent();
          if (cancelled) return;

          router.replace(profile ? "/home" : "/onboarding/profile");
        }
      }
    }

    checkAccess();

    return () => {
      cancelled = true;
    };
  }, [step, router]);

  function goToStep(target: OnboardingStep) {
    router.push(stepHref[target]);
  }

  const chrome = titles[step];
  const position = stepperPosition[step];
  const showChrome = step !== "profile" || isProfileAuthorized;

  return (
    <OnboardingNavigationContext.Provider value={goToStep}>
      <div className="flex flex-col gap-6 pb-8 empty:pb-0">
        {chrome && showChrome ? (
          <>
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

      <StepContent step={step} isProfileAuthorized={isProfileAuthorized} />
    </OnboardingNavigationContext.Provider>
  );
}

function StepContent({ step, isProfileAuthorized }: { step: OnboardingStep; isProfileAuthorized: boolean }) {
  if (step === "profile" && !isProfileAuthorized) {
    return (
      <div className="flex flex-1 items-center justify-center py-16">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
      </div>
    );
  }

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
