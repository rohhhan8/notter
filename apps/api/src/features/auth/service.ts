import type { AuthResponse, SignInRequest, SignUpRequest } from "@notter/types";
import { getSupabaseForRequest } from "@/lib/supabase";

export async function signUp({ email, password }: SignUpRequest): Promise<AuthResponse> {
  const supabase = await getSupabaseForRequest();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) throw error;
  if (!data.user) throw new Error("Sign up did not return a user");

  return {
    userId: data.user.id,
    email: data.user.email ?? email,
    session: data.session
      ? {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          expiresAt: data.session.expires_at ?? Math.floor(Date.now() / 1000) + 3600,
        }
      : undefined,
  };
}

export async function signIn({ email, password }: SignInRequest): Promise<AuthResponse> {
  const supabase = await getSupabaseForRequest();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw error;
  if (!data.session) throw new Error("Sign in did not return a session");

  return {
    userId: data.user.id,
    email: data.user.email ?? email,
    session: {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at ?? Math.floor(Date.now() / 1000) + 3600,
    },
  };
}

export async function refreshSession(refreshToken: string): Promise<AuthResponse> {
  const supabase = await getSupabaseForRequest();
  const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });

  if (error) throw error;
  if (!data.session || !data.user) throw new Error("Could not refresh session");

  return {
    userId: data.user.id,
    email: data.user.email ?? "",
    session: {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at ?? Math.floor(Date.now() / 1000) + 3600,
    },
  };
}

export async function getGoogleOAuthUrl(redirectTo: string): Promise<string> {
  const supabase = await getSupabaseForRequest();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo, skipBrowserRedirect: true },
  });

  if (error) throw error;
  if (!data.url) throw new Error("Supabase did not return an OAuth URL");

  return data.url;
}

export async function exchangeCodeForSession(code: string): Promise<AuthResponse> {
  const supabase = await getSupabaseForRequest();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) throw error;
  if (!data.user) throw new Error("OAuth sign-in did not return a user");

  return {
    userId: data.user.id,
    email: data.user.email ?? "",
    session: data.session
      ? {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          expiresAt: data.session.expires_at ?? Math.floor(Date.now() / 1000) + 3600,
        }
      : undefined,
  };
}

export async function signOut(): Promise<void> {
  const supabase = await getSupabaseForRequest();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentSession(): Promise<AuthResponse | null> {
  const supabase = await getSupabaseForRequest();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) return null;

  return { userId: data.user.id, email: data.user.email ?? "" };
}
