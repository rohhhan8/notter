"use client";

import Link from "next/link";
import { PrimaryButton } from "@/features/onboarding/components/primary-button";

export function WelcomeScreen() {
  return (
    <div className="flex flex-1 flex-col justify-center gap-12 py-12">
      <div className="flex flex-col gap-4">
        <h1 className="font-heading text-4xl leading-[1.25] font-semibold tracking-tight text-balance sm:text-5xl">
          Every idea, right where you
          <br />
          left it
        </h1>
        <p className="max-w-[42ch] text-lg leading-relaxed text-muted-foreground text-pretty">
          Notter is a fast, distraction-free place to capture notes and find them again in seconds, on your phone or your desktop.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Link href="/onboarding/sign-up">
          <PrimaryButton className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25">
            Get started
          </PrimaryButton>
        </Link>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/onboarding/sign-in" className="font-medium text-foreground underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
