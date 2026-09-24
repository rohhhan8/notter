"use client";

import { createContext, useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createOnboardingClient } from "@notter/api-client";
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

/** Steps a signed-in user shouldn't be able to sit on — profile/welcome-back are still valid mid-onboarding. */
const signedOutOnlySteps: OnboardingStep[] = ["welcome", "sign-up", "sign-in"];

/** Navigate to another onboarding step by name. See OnboardingFlow for why this is a plain router.push. */
export const OnboardingNavigationContext = createContext<(step: OnboardingStep) => void>(() => {});

export function useOnboardingNavigate() {
  return useContext(OnboardingNavigationContext);
}

/**
 * Mounted once by app/onboarding/layout.tsx — a layout persists across
 * nested route changes in the App Router, so this component instance (and
 * everything inside it: the stepper, the header) never unmounts as the user
 * moves between onboarding steps. It reads the current step from the URL
 * itself (usePathname), rather than each route's page.tsx passing it down,
 * specifically so the layout doesn't need `children` (whose identity swaps
 * on every navigation) in the persistent part of the tree at all. Route
 * pages under app/onboarding/* exist only so the URL and browser
 * back/forward keep working — their own content is unused, StepContent below
 * is a plain switch on the step name.
 *
 * There's no in-app back button: the device's own back gesture/button
 * already navigates correctly since every step is a real route, and a
 * second back affordance next to the wordmark collided with it on narrow
 * screens.
 *
 * Route protection (redirecting a signed-in user off welcome/sign-up/sign-in,
 * and a signed-out user off /home) is a client-side check here and in
 * HomeShell, not a server-side proxy: apps/api owns the Supabase session
 * cookie on its own origin, so apps/web's server can never see it on an
 * incoming request — a proxy here checking "is this request authenticated"
 * would always see a signed-out user, which is why the previous proxy-based
 * version of this bounced a freshly-signed-in user straight back to
 * /onboarding.
 */
export function OnboardingFlow() {
  const pathname = usePathname();
  const router = useRouter();
  const step = getStepFromPathname(pathname);

  useEffect(() => {
    if (!signedOutOnlySteps.includes(step)) return;

    let cancelled = false;

    async function checkSession() {
      const client = createOnboardingClient({ baseUrl: getApiBaseUrl() });
      const session = await client.getSession();
      if (!cancelled && session) {
        router.replace("/home");
      }
    }

    checkSession();

    return () => {
      cancelled = true;
    };
  }, [step, router]);

  function goToStep(target: OnboardingStep) {
    router.push(stepHref[target]);
  }

  const chrome = titles[step];
  const position = stepperPosition[step];

  return (
    <OnboardingNavigationContext.Provider value={goToStep}>
      <div className="flex flex-col gap-6 pb-8 empty:pb-0">
        {chrome ? (
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
