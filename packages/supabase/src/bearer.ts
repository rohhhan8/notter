import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./server";

/**
 * Creates a Supabase client configured with a Bearer access token.
 * This sets the Authorization header so that Supabase Auth and Row Level Security (RLS)
 * automatically associate operations with the authenticated user (auth.uid()).
 */
export function createSupabaseBearerClient(token?: string) {
  const { url, anonKey } = getSupabaseEnv();

  return createClient(url, anonKey, {
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
