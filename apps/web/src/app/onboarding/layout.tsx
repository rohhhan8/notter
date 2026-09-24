import Link from "next/link";
import { ShowcasePanel } from "@/features/onboarding/components/showcase-panel";
import { OnboardingFlow } from "@/features/onboarding/components/onboarding-flow";
import { Wordmark } from "@/components/wordmark";

export default function OnboardingLayout({ children }: LayoutProps<"/onboarding">) {
  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-background lg:flex-row">
      <main className="mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col overflow-y-auto px-6 pb-[max(env(safe-area-inset-bottom),24px)] pt-[max(env(safe-area-inset-top),24px)] sm:max-w-lg sm:px-8 lg:mx-0 lg:max-w-none lg:basis-1/2 lg:justify-center lg:px-16 lg:py-12 xl:px-24">
        <div className="flex w-full max-w-md flex-1 flex-col lg:flex-none">
          <Wordmark className="mb-8 text-lg lg:hidden" />
          <Link href="/onboarding" className="hidden lg:absolute lg:left-16 lg:top-12 lg:block xl:left-24">
            <Wordmark className="text-lg" />
          </Link>
          {/* Each route's page.tsx renders nothing visible — OnboardingFlow
              (mounted once, here) derives the active step from the URL
              itself and owns all step content and the persistent chrome. */}
          {children}
          <OnboardingFlow />
        </div>
      </main>
      <aside className="hidden bg-[#131313] lg:flex lg:basis-1/2">
        <ShowcasePanel />
      </aside>
    </div>
  );
}
