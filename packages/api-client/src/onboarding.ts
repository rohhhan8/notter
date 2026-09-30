import type { AuthResponse, SignInRequest, SignUpRequest } from "@notter/types";
import { apiRequest, type RequestOptions } from "./http";
import { authStorage } from "./storage";

type ClientOptions = Pick<RequestOptions, "baseUrl" | "cookieHeader">;

export function createOnboardingClient(options: ClientOptions) {
  return {
    signUp: async (payload: SignUpRequest): Promise<AuthResponse> => {
      const res = await apiRequest<AuthResponse>({
        ...options,
        path: "/api/auth/sign-up",
        method: "POST",
        body: payload,
      });
      if (res.session) {
        authStorage.set(res.session);
      }
      return res;
    },

    signIn: async (payload: SignInRequest): Promise<AuthResponse> => {
      const res = await apiRequest<AuthResponse>({
        ...options,
        path: "/api/auth/sign-in",
        method: "POST",
        body: payload,
      });
      if (res.session) {
        authStorage.set(res.session);
      }
      return res;
    },

    refreshSession: async (refreshToken: string): Promise<AuthResponse> => {
      const res = await apiRequest<AuthResponse>({
        ...options,
        path: "/api/auth/refresh",
        method: "POST",
        body: { refreshToken },
      });
      if (res.session) {
        authStorage.set(res.session);
      }
      return res;
    },

    signOut: async () => {
      authStorage.clear();
      try {
        return await apiRequest<{ success: true }>({
          ...options,
          path: "/api/auth/sign-out",
          method: "POST",
        });
      } catch {
        return { success: true as const };
      }
    },

    getSession: async (): Promise<AuthResponse | null> => {
      const stored = authStorage.get();
      if (!stored) {
        return null;
      }

      try {
        const res = await apiRequest<AuthResponse | null>({
          ...options,
          path: "/api/auth/session",
        });
        if (!res) {
          authStorage.clear();
          return null;
        }
        return {
          ...res,
          session: stored,
        };
      } catch {
        authStorage.clear();
        return null;
      }
    },
  };
}
