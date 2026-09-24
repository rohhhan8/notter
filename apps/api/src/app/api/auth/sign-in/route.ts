import type { SignInRequest } from "@notter/types";
import { signIn } from "@/features/auth/service";
import { errorResponse, handleApiError } from "@/lib/api-response";

export async function POST(request: Request) {
  const body = (await request.json()) as SignInRequest;

  if (!body.email || !body.password) {
    return errorResponse("email and password are required", 400);
  }

  try {
    const result = await signIn(body);
    return Response.json(result, { status: 200 });
  } catch (error) {
    return handleApiError(error, 401);
  }
}
