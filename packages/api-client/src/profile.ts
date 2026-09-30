import type { CreateProfileRequest, UpdateProfileRequest, Profile } from "@notter/types";
import { apiRequest, type RequestOptions } from "./http";

type ClientOptions = Pick<RequestOptions, "baseUrl" | "cookieHeader">;

export function createProfileClient(options: ClientOptions) {
  return {
    create: (payload: CreateProfileRequest) =>
      apiRequest<Profile>({ ...options, path: "/api/profile", method: "POST", body: payload }),

    getCurrent: () => apiRequest<Profile | null>({ ...options, path: "/api/profile" }),

    update: (payload: UpdateProfileRequest) =>
      apiRequest<Profile>({ ...options, path: "/api/profile", method: "PATCH", body: payload }),
  };
}
