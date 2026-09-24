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
    await exchangeCodeForSession(code);
    return Response.redirect(`${origin}/onboarding/welcome-back`, 302);
  } catch {
    return Response.redirect(`${origin}/onboarding/sign-in?error=oauth_failed`, 302);
  }
}
