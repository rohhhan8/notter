import { cookies } from "next/headers";
import { createSupabaseRouteHandlerClient } from "@notter/supabase";

export async function getSupabaseForRequest() {
  const cookieStore = await cookies();
  return createSupabaseRouteHandlerClient(cookieStore);
}
