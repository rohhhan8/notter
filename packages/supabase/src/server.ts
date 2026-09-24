import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";

export interface SupabaseEnv {
  url: string;
  anonKey: string;
}

export function getSupabaseEnv(): SupabaseEnv {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables");
  }

  return { url, anonKey };
}

export function createSupabaseServerClient(cookies: CookieMethodsServer) {
  const { url, anonKey } = getSupabaseEnv();
  return createServerClient(url, anonKey, { cookies });
}
