import type { RefreshSessionRequest } from "@notter/types";
import { refreshSession } from "@/features/auth/service";
import { errorResponse, handleApiError } from "@/lib/api-response";

export async function POST(request: Request) {
  const body = (await request.json()) as RefreshSessionRequest;

  if (!body.refreshToken) {
    return errorResponse("refreshToken is required", 400);
  }

  try {
    const result = await refreshSession(body.refreshToken);
    return Response.json(result, { status: 200 });
  } catch (error) {
    return handleApiError(error, 401);
  }
}
