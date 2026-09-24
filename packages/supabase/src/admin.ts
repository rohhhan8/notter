import { createClient } from "@supabase/supabase-js";

/**
 * Privileged client using the service role key. Bypasses Row Level Security.
 * Server-only — never expose SUPABASE_SERVICE_ROLE_KEY to the client bundle.
 */
export function createSupabaseAdminClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
