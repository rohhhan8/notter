import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { stepHref } from "@/features/onboarding/steps";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

const onboardingRoutes = Object.values(stepHref);

/**
 * apps/api (a different origin) owns the Supabase session cookies, so
 * apps/web can't read "is this user signed in" from its own request cookies
 * directly — browsers scope cookies per-origin. This proxy instead asks
 * apps/api's session endpoint, forwarding this request's cookies along, and
 * redirects based on the answer:
 *
 * - Signed in + visiting onboarding/auth screens -> bounce to `/`.
 * - Signed out + visiting the app shell (`/`) -> bounce to `/onboarding`.
 *
 * This runs before the page renders, so it blocks the browser back/forward
 * button from ever showing a protected or auth screen the user shouldn't see
 * — the server simply never serves it, rather than a client-side redirect
 * that would flash the wrong page first.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isOnboardingRoute = onboardingRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isHome = pathname === "/";

  if (!isOnboardingRoute && !isHome) {
    return NextResponse.next();
  }

  let isSignedIn = false;
  try {
    const response = await fetch(`${API_URL}/api/auth/session`, {
      headers: { cookie: request.headers.get("cookie") ?? "" },
      cache: "no-store",
      // Bound the worst case so a slow/hanging apps/api can't stall every
      // navigation indefinitely. A timeout is treated the same as the
      // existing "unreachable" case below — this changes how long a broken
      // backend can block navigation, not what the auth check itself does.
      signal: AbortSignal.timeout(2000),
    });
    if (response.ok) {
      const session = await response.json();
      isSignedIn = Boolean(session);
    }
  } catch {
    // If the API is unreachable or too slow, fail open on the auth screens
    // (don't lock users out of onboarding) rather than fail closed on the
    // home shell.
    isSignedIn = false;
  }

  const isPostAuthRoute = pathname === stepHref["welcome-back"] || pathname === stepHref.profile;

  if (isSignedIn && isOnboardingRoute && !isPostAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isSignedIn && isHome) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/onboarding/:path*"],
};
