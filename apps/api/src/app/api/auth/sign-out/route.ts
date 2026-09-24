import { signOut } from "@/features/auth/service";
import { errorResponse, toErrorMessage } from "@/lib/api-response";

export async function POST() {
  try {
    await signOut();
    return Response.json({ success: true });
  } catch (error) {
    return errorResponse(toErrorMessage(error), 400);
  }
}
