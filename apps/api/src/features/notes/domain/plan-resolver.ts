import type { UserPlan } from "@notter/types";
import { getSupabaseForRequest } from "@/lib/supabase";

export async function resolveUserPlan(): Promise<{ plan: UserPlan; userId: string }> {
  const supabase = await getSupabaseForRequest();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    throw new Error("Not authenticated");
  }

  const userId = userData.user.id;

  // Check user profile for subscription plan, or user_metadata
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .maybeSingle();

  const planFromProfile = profile?.plan as UserPlan | undefined;
  const planFromMetadata = userData.user.user_metadata?.plan as UserPlan | undefined;

  const plan: UserPlan =
    planFromProfile === "pro" || planFromMetadata === "pro" ? "pro" : "free";

  return { plan, userId };
}
