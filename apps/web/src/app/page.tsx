"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createOnboardingClient } from "@notter/api-client";
import { getApiBaseUrl } from "@/lib/env";
import { LoadingScreen } from "@/components/loading-screen";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function redirect() {
      const client = createOnboardingClient({ baseUrl: getApiBaseUrl() });
      const session = await client.getSession();
      if (cancelled) return;
      router.replace(session ? "/home" : "/onboarding");
    }

    redirect();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return <LoadingScreen />;
}
