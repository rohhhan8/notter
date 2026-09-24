import type { AuthResponse, SignInRequest, SignUpRequest } from "@notter/types";
import { apiRequest, type RequestOptions } from "./http";

type ClientOptions = Pick<RequestOptions, "baseUrl" | "cookieHeader">;

export function createOnboardingClient(options: ClientOptions) {
  return {
    signUp: (payload: SignUpRequest) =>
      apiRequest<AuthResponse>({ ...options, path: "/api/auth/sign-up", method: "POST", body: payload }),

    signIn: (payload: SignInRequest) =>
      apiRequest<AuthResponse>({ ...options, path: "/api/auth/sign-in", method: "POST", body: payload }),

    signOut: () => apiRequest<{ success: true }>({ ...options, path: "/api/auth/sign-out", method: "POST" }),

    getSession: () => apiRequest<AuthResponse | null>({ ...options, path: "/api/auth/session" }),
  };
}
