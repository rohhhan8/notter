import type { CreateProfileRequest, Profile } from "@notter/types";
import { getSupabaseForRequest } from "@/lib/supabase";

interface ProfileRow {
  id: string;
  full_name: string;
  username: string;
  intent: string;
}

function toProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    fullName: row.full_name,
    username: row.username,
    intent: row.intent as Profile["intent"],
  };
}

export async function createProfile(payload: CreateProfileRequest): Promise<Profile> {
  const supabase = await getSupabaseForRequest();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: userData.user.id,
      full_name: payload.fullName,
      username: payload.username,
      intent: payload.intent,
    })
    .select()
    .single();

  if (error) throw error;

  return toProfile(data as ProfileRow);
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await getSupabaseForRequest();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select()
    .eq("id", userData.user.id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return toProfile(data as ProfileRow);
}
