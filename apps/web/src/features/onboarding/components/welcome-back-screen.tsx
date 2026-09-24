"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createProfileClient } from "@notter/api-client";
import { getApiBaseUrl } from "@/lib/env";
import { useOnboardingNavigate } from "@/features/onboarding/components/onboarding-flow";

const CONTINUE_AFTER_MS = 1200;

type Status = { kind: "checking" } | { kind: "resolved"; name: string };

export function WelcomeBackScreen() {
  const router = useRouter();
  const navigate = useOnboardingNavigate();
  const [status, setStatus] = useState<Status>({ kind: "checking" });

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      const client = createProfileClient({ baseUrl: getApiBaseUrl() });
      const profile = await client.getCurrent();

      if (cancelled) return;

      if (!profile) {
        navigate("profile");
        return;
      }

      setStatus({ kind: "resolved", name: profile.fullName.split(" ")[0] });
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status.kind !== "resolved") return;
    const timeout = window.setTimeout(() => router.push("/"), CONTINUE_AFTER_MS);
    return () => window.clearTimeout(timeout);
  }, [status, router]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center">
      <p className="text-sm font-medium text-muted-foreground">
        {status.kind === "checking" ? "Looking for your account…" : "Signed in"}
      </p>
      <h1 className="font-heading text-4xl leading-[1.15] font-semibold tracking-tight text-balance sm:text-5xl">
        {status.kind === "checking" ? (
          "Just a moment"
        ) : (
          <>
            Welcome back,
            <br />
            {status.name}
          </>
        )}
      </h1>
    </div>
  );
}
