import type { AuthSession } from "@notter/types";

export interface StoredSession extends AuthSession {
  lastActiveAt: number; // Unix timestamp in milliseconds
}

const STORAGE_KEY = "notter_auth_session";
export const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export const authStorage = {
  get(): StoredSession | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw) as StoredSession;

      // Enforce 1-week continuous inactivity policy:
      // If the user hasn't opened or interacted with the app for 7 consecutive days, expire the session.
      if (Date.now() - session.lastActiveAt > ONE_WEEK_MS) {
        authStorage.clear();
        return null;
      }

      return session;
    } catch {
      return null;
    }
  },

  set(session: AuthSession) {
    if (typeof window === "undefined") return;
    const stored: StoredSession = {
      ...session,
      lastActiveAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  },

  touch() {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const session = JSON.parse(raw) as StoredSession;
      session.lastActiveAt = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      // ignore parse error
    }
  },

  isExpiringSoon(thresholdSeconds = 60): boolean {
    const session = authStorage.get();
    if (!session) return false;
    const nowSeconds = Math.floor(Date.now() / 1000);
    return session.expiresAt - nowSeconds <= thresholdSeconds;
  },

  clear() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  },
};
