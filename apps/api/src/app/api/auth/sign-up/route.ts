import type { SignUpRequest } from "@notter/types";
import { signUp } from "@/features/auth/service";
import { errorResponse, toErrorMessage } from "@/lib/api-response";

export async function POST(request: Request) {
  const body = (await request.json()) as SignUpRequest;

  if (!body.email || !body.password) {
    return errorResponse("email and password are required", 400);
  }

  try {
    const result = await signUp(body);
    return Response.json(result, { status: 201 });
  } catch (error) {
    return errorResponse(toErrorMessage(error), 400);
  }
}
