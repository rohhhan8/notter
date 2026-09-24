"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createOnboardingClient, createProfileClient } from "@notter/api-client";
import type { Profile } from "@notter/types";
import { getApiBaseUrl } from "@/lib/env";
import { Button } from "@/components/ui/button";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function HomeShell() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      const client = createProfileClient({ baseUrl: getApiBaseUrl() });
      const result = await client.getCurrent();
      if (!cancelled) setProfile(result);
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSignOut() {
    setIsSigningOut(true);
    const client = createOnboardingClient({ baseUrl: getApiBaseUrl() });
    await client.signOut();
    router.push("/onboarding");
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-semibold">N</span>
          </div>
          <span className="font-heading text-sm font-semibold">Notter</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleSignOut} disabled={isSigningOut}>
          {isSigningOut ? "Signing out…" : "Sign out"}
        </Button>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-sm font-medium text-muted-foreground">{getGreeting()}</p>
        <h1 className="font-heading text-4xl leading-[1.15] font-semibold tracking-tight text-balance sm:text-5xl">
          {profile === undefined ? "Loading…" : profile ? profile.fullName.split(" ")[0] : "Welcome"}
        </h1>
        <p className="max-w-[32ch] text-base text-muted-foreground text-pretty">
          The Notter workspace lands here next.
        </p>
      </main>
    </div>
  );
}
