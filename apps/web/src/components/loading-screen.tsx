"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const messages = [
  "Setting up your workspace…",
  "Syncing your notes…",
  "Almost there…",
];

const MESSAGE_INTERVAL_MS = 1600;

export function LoadingScreen() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % messages.length);
    }, MESSAGE_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-background px-6 text-center">
      <Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden />
      <p className="text-sm font-medium text-muted-foreground" role="status">
        {messages[index]}
      </p>
    </div>
  );
}
