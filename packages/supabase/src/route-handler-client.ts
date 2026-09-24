import { createSupabaseServerClient } from "./server";

type NextCookieStore = {
  getAll(): { name: string; value: string }[];
  set(name: string, value: string, options?: Record<string, unknown>): void;
};

/**
 * Builds a Supabase client bound to a Next.js Route Handler's cookie store
 * (from `await cookies()` in `next/headers`). Auth session cookies are read
 * from and written back to the response via this store.
 */
export function createSupabaseRouteHandlerClient(cookieStore: NextCookieStore) {
  return createSupabaseServerClient({
    getAll() {
      return cookieStore.getAll();
    },
    setAll(cookiesToSet) {
      for (const { name, value, options } of cookiesToSet) {
        cookieStore.set(name, value, options);
      }
    },
  });
}
