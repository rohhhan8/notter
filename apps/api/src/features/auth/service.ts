import type { AuthResponse, SignInRequest, SignUpRequest } from "@notter/types";
import { getSupabaseForRequest } from "@/lib/supabase";

export async function signUp({ email, password }: SignUpRequest): Promise<AuthResponse> {
  const supabase = await getSupabaseForRequest();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) throw error;
  if (!data.user) throw new Error("Sign up did not return a user");

  return { userId: data.user.id, email: data.user.email ?? email };
}

export async function signIn({ email, password }: SignInRequest): Promise<AuthResponse> {
  const supabase = await getSupabaseForRequest();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw error;

  return { userId: data.user.id, email: data.user.email ?? email };
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

  return { userId: data.user.id, email: data.user.email ?? "" };
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
