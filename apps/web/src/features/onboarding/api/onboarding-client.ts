"use client";

import { createOnboardingClient } from "@notter/api-client";
import { getApiBaseUrl } from "@/lib/env";

export function useOnboardingClient() {
  return createOnboardingClient({ baseUrl: getApiBaseUrl() });
}
