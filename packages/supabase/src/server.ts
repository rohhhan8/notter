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
  return createServerClient(url, anonKey, {
    cookies,
    // apps/web and apps/api are deployed on different *.vercel.app
    // subdomains, which browsers treat as cross-site. SameSite=Lax (the
    // default) is never sent on a cross-site fetch(), so the session cookie
    // would silently fail to reach apps/api from the browser. `none`
    // requires `secure`, which is fine since both are always HTTPS.
    //
    // Trade-off: SameSite=None cookies are more exposed to CSRF than Lax.
    // The auth routes here only accept state-changing requests (sign-in,
    // sign-up, sign-out, profile writes) over fetch() with an explicit
    // Origin header apps/api's CORS proxy already validates — but this is
    // not a substitute for real CSRF protection (e.g. a token) if this API
    // ever needs to trust cookie-authenticated requests from a context CORS
    // doesn't cover (like a plain form POST or an <img> tag).
    cookieOptions: { sameSite: "none", secure: true },
  });
}
