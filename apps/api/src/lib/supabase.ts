import { headers } from "next/headers";
import { createSupabaseBearerClient } from "@notter/supabase";

export async function getSupabaseForRequest() {
  const headerList = await headers();
  const authHeader = headerList.get("authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "").trim();
  return createSupabaseBearerClient(token || undefined);
}
