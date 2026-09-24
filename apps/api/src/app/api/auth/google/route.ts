import { getGoogleOAuthUrl } from "@/features/auth/service";

export async function GET(request: Request) {
  const callbackUrl = new URL("/api/auth/callback", request.url).toString();

  try {
    const oauthUrl = await getGoogleOAuthUrl(callbackUrl);
    return Response.redirect(oauthUrl, 302);
  } catch {
    const origin = process.env.WEB_APP_ORIGIN?.split(",")[0]?.trim() ?? "http://localhost:3000";
    return Response.redirect(`${origin}/onboarding/sign-in?error=oauth_failed`, 302);
  }
}
