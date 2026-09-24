"use client";

import { useEffect, useState } from "react";
import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";

const BAR_COUNT = 5;
const BAR_ANIMATION_DELAYS_MS = [0, 120, 240, 360, 480];

interface VoicePillProps {
  onStop?: () => void;
  className?: string;
}

export function VoicePill({ onStop, className }: VoicePillProps) {
  const [isListening, setIsListening] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    if (!isListening) return;
    setElapsedMs(0);
    const interval = window.setInterval(() => setElapsedMs((ms) => ms + 100), 100);
    return () => window.clearInterval(interval);
  }, [isListening]);

  function handleClick() {
    if (isListening) {
      setIsListening(false);
      onStop?.();
    } else {
      setIsListening(true);
    }
  }

  const seconds = Math.floor(elapsedMs / 1000);
  const timeLabel = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isListening}
      aria-label={isListening ? "Stop voice input" : "Start voice input"}
      className={cn(
        "flex min-w-0 items-center gap-2 overflow-hidden rounded-full border border-border bg-card text-foreground shadow-sm transition-all duration-300 ease-out",
        isListening
          ? "w-28 shrink justify-start px-3 py-2 sm:w-40"
          : "size-8 shrink-0 justify-center p-0 hover:bg-muted",
        className,
      )}
    >
      {isListening ? (
        <>
          <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <Square className="size-2.5 fill-current" aria-hidden />
          </span>
          <span className="flex flex-1 items-center justify-center gap-0.5" aria-hidden>
            {BAR_ANIMATION_DELAYS_MS.map((delay, index) => (
              <span
                key={index}
                className="w-0.5 animate-voice-bar rounded-full bg-primary"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </span>
          <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">{timeLabel}</span>
        </>
      ) : (
        <Mic className="size-4" aria-hidden />
      )}
    </button>
  );
}
