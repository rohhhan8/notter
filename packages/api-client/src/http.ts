import { authStorage } from "./storage";
import type { AuthResponse, RefreshSessionRequest } from "@notter/types";

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    super(`API request failed with status ${status}`);
    this.status = status;
    this.body = body;
  }
}

export interface RequestOptions {
  baseUrl: string;
  path: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  /** Explicit token if calling outside of browser or bypassing storage */
  token?: string;
  /** Forwarded when calling from a Next.js Server Component/Route Handler */
  cookieHeader?: string;
  /** Internal flag to avoid infinite refresh retry loops */
  _isRetry?: boolean;
}

// Mutex to serialize refreshing when multiple requests trigger near-expiry
let activeRefreshPromise: Promise<string | null> | null = null;

async function refreshAuthToken(baseUrl: string, refreshToken: string): Promise<string | null> {
  if (activeRefreshPromise) {
    return activeRefreshPromise;
  }

  activeRefreshPromise = (async () => {
    try {
      const response = await fetch(`${baseUrl}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken } as RefreshSessionRequest),
      });

      if (!response.ok) {
        authStorage.clear();
        return null;
      }

      const data = (await response.json()) as AuthResponse;
      if (data.session) {
        authStorage.set(data.session);
        return data.session.accessToken;
      }
      return null;
    } catch {
      return null;
    } finally {
      activeRefreshPromise = null;
    }
  })();

  return activeRefreshPromise;
}

export async function apiRequest<T>({
  baseUrl,
  path,
  method = "GET",
  body,
  token,
  cookieHeader,
  _isRetry = false,
}: RequestOptions): Promise<T> {
  let authToken = token;

  // If in browser and no explicit token passed, check storage
  if (!authToken && typeof window !== "undefined") {
    let session = authStorage.get();

    // If session exists and token is expiring soon, proactively refresh
    const isAuthRoute = path.startsWith("/api/auth/");
    if (session && !isAuthRoute && authStorage.isExpiringSoon(60)) {
      const newAccessToken = await refreshAuthToken(baseUrl, session.refreshToken);
      if (newAccessToken) {
        authToken = newAccessToken;
      } else {
        session = authStorage.get();
        authToken = session?.accessToken;
      }
    } else if (session) {
      authToken = session.accessToken;
      authStorage.touch();
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }
  if (cookieHeader) {
    headers["cookie"] = cookieHeader;
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // If 401 and we have a stored refresh token, attempt one retry after refresh
  if (response.status === 401 && !_isRetry && typeof window !== "undefined") {
    const session = authStorage.get();
    if (session?.refreshToken && !path.startsWith("/api/auth/")) {
      const newAccessToken = await refreshAuthToken(baseUrl, session.refreshToken);
      if (newAccessToken) {
        return apiRequest<T>({
          baseUrl,
          path,
          method,
          body,
          token: newAccessToken,
          _isRetry: true,
        });
      }
    }
  }

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    throw new ApiError(response.status, data);
  }

  return data as T;
}
