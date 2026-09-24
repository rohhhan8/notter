"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { getApiBaseUrl } from "@/lib/env";

function GoogleLogo() {
  return (
    <svg viewBox="0 0 20 20" className="size-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M19.6 10.23c0-.68-.06-1.36-.18-2.02H10v3.83h5.38a4.6 4.6 0 0 1-1.99 3.02v2.5h3.22c1.89-1.74 2.98-4.3 2.98-7.33Z"
      />
      <path
        fill="#34A853"
        d="M10 20c2.7 0 4.96-.89 6.61-2.42l-3.22-2.5c-.9.6-2.05.95-3.39.95-2.6 0-4.8-1.76-5.59-4.12H1.09v2.59A10 10 0 0 0 10 20Z"
      />
      <path fill="#FBBC05" d="M4.41 11.91a6 6 0 0 1 0-3.82V5.5H1.09a10 10 0 0 0 0 9l3.32-2.59Z" />
      <path
        fill="#EA4335"
        d="M10 3.98c1.47 0 2.79.5 3.83 1.49l2.87-2.87A9.96 9.96 0 0 0 10 0a10 10 0 0 0-8.91 5.5l3.32 2.59C5.2 5.74 7.4 3.98 10 3.98Z"
      />
    </svg>
  );
}

interface GoogleSignInButtonProps {
  className?: string;
}

export function GoogleSignInButton({ className }: GoogleSignInButtonProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  async function handleClick() {
    setIsRedirecting(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${getApiBaseUrl()}/api/auth/callback` },
    });

    if (error) setIsRedirecting(false);
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      disabled={isRedirecting}
      className={cn("h-11 w-full gap-2.5 text-base font-medium", className)}
    >
      <GoogleLogo />
      {isRedirecting ? "Redirecting…" : "Continue with Google"}
    </Button>
  );
}
