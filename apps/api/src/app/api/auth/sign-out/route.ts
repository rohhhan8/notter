import { signOut } from "@/features/auth/service";
import { handleApiError } from "@/lib/api-response";

export async function POST() {
  try {
    await signOut();
    return Response.json({ success: true });
  } catch (error) {
    return handleApiError(error, 400);
  }
}
