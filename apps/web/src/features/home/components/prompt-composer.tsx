"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { VoicePill } from "@/features/home/components/voice-pill";

interface PromptComposerProps {
  onSubmit: (prompt: string) => void;
  isGenerating?: boolean;
  className?: string;
}

export function PromptComposer({ onSubmit, isGenerating, className }: PromptComposerProps) {
  const [value, setValue] = useState("");

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || isGenerating) return;
    onSubmit(trimmed);
    setValue("");
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    submit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex w-full items-end gap-2 rounded-3xl border border-border bg-card px-5 py-4 shadow-sm transition-shadow focus-within:shadow-md",
        className,
      )}
    >
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything..."
        rows={1}
        disabled={isGenerating}
        className="min-w-0 max-h-40 flex-1 resize-none bg-transparent text-[0.95rem] leading-6 text-foreground outline-none placeholder:text-muted-foreground/80 pb-2 disabled:opacity-60"
      />
      <VoicePill />
      <button
        type="submit"
        disabled={!value.trim() || isGenerating}
        aria-label="Send"
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
      >
        {isGenerating ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <ArrowUp className="size-4" aria-hidden />}
      </button>
    </form>
  );
}
