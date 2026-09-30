import { exchangeCodeForSession } from "@/features/auth/service";

function webAppOrigin(): string {
  return process.env.WEB_APP_ORIGIN?.split(",")[0]?.trim() ?? "http://localhost:3000";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const origin = webAppOrigin();

  if (!code) {
    return Response.redirect(`${origin}/onboarding/sign-in?error=missing_code`, 302);
  }

  try {
    const result = await exchangeCodeForSession(code);

    const redirectUrl = new URL(`${origin}/onboarding/welcome-back`);
    if (result.session) {
      redirectUrl.searchParams.set("access_token", result.session.accessToken);
      redirectUrl.searchParams.set("refresh_token", result.session.refreshToken);
      redirectUrl.searchParams.set("expires_at", String(result.session.expiresAt));
    }

    return Response.redirect(redirectUrl.toString(), 302);
  } catch (error) {
    console.error(error);
    return Response.redirect(`${origin}/onboarding/sign-in?error=oauth_failed`, 302);
  }
}
