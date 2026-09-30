import type { CreateProfileRequest, UpdateProfileRequest } from "@notter/types";
import { createProfile, getCurrentProfile, updateProfile } from "@/features/profile/service";
import { errorResponse, handleApiError } from "@/lib/api-response";

export async function GET() {
  try {
    const profile = await getCurrentProfile();
    return Response.json(profile, { status: 200 });
  } catch (error) {
    return handleApiError(error, 400);
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as CreateProfileRequest;

  if (!body.fullName || !body.username || !body.intent) {
    return errorResponse("fullName, username, and intent are required", 400);
  }

  try {
    const profile = await createProfile(body);
    return Response.json(profile, { status: 201 });
  } catch (error) {
    return handleApiError(error, 400);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as UpdateProfileRequest;
    const profile = await updateProfile(body);
    return Response.json(profile, { status: 200 });
  } catch (error) {
    return handleApiError(error, 400);
  }
}
