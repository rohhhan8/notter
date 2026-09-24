"use client";

import { ArrowUp, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { TypedText } from "./typed-text";

const noteTitles = ["Product roadmap Q3", "Client call notes", "Reading list", "Trip planning"];

function Sidebar({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="flex w-40 shrink-0 flex-col gap-1 border-r border-white/10 bg-[#181818] p-3">
      <div className="mb-2 flex items-center gap-1.5 px-2 text-white/70">
        <Plus className="size-3.5 shrink-0" />
        <span className="text-xs font-medium">New note</span>
      </div>
      {noteTitles.map((title, index) => (
        <div
          key={title}
          className={cn(
            "truncate rounded-md px-2 py-1.5 text-xs",
            index === activeIndex ? "bg-white/10 text-white" : "text-white/40"
          )}
        >
          {title}
        </div>
      ))}
    </div>
  );
}

interface CenteredPromptProps {
  eyebrow: string;
  text: string;
  speed: number;
  onDone: () => void;
}

function CenteredPrompt({ eyebrow, text, speed, onDone }: CenteredPromptProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-8">
      <span className="text-sm font-medium text-white/50">{eyebrow}</span>
      <div className="flex h-[76px] w-full max-w-[380px] items-end gap-2 overflow-hidden rounded-3xl border border-white/10 bg-[#272727] p-4">
        <span className="min-w-0 flex-1 self-center text-sm leading-relaxed break-words text-white/90">
          <TypedText onDone={onDone} speed={speed} text={text} />
        </span>
        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/15">
          <ArrowUp className="size-3.5 text-white" />
        </div>
      </div>
    </div>
  );
}

interface SceneProps {
  onDone: () => void;
}

export function WritingScene({ onDone }: SceneProps) {
  return (
    <div className="flex min-h-0 flex-1">
      <Sidebar activeIndex={0} />
      <CenteredPrompt
        eyebrow="What's on your mind?"
        speed={26}
        text="Ship the onboarding flow first, then move to the editor"
        onDone={onDone}
      />
    </div>
  );
}

export function SearchScene({ onDone }: SceneProps) {
  return (
    <div className="flex min-h-0 flex-1">
      <Sidebar activeIndex={-1} />
      <CenteredPrompt eyebrow="Search your notes" speed={45} text="roadmap Q3" onDone={onDone} />
    </div>
  );
}
