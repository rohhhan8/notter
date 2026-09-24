"use client";

import type { ProfileIntent } from "@notter/types";
import { cn } from "@/lib/utils";

const options: { value: ProfileIntent; label: string; description: string }[] = [
  { value: "personal", label: "Personal", description: "Journaling, ideas, day to day notes" },
  { value: "work", label: "Work", description: "Meeting notes, projects, planning" },
  { value: "study", label: "Study", description: "Lectures, research, revision" },
];

interface IntentPickerProps {
  value?: ProfileIntent;
  onChange: (value: ProfileIntent) => void;
  error?: string;
}

export function IntentPicker({ value, onChange, error }: IntentPickerProps) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-1 text-sm font-medium">What will you use Notter for?</legend>
      <div className="flex flex-col gap-2">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex flex-col gap-0.5 rounded-lg border px-4 py-3 text-left transition-colors duration-150 ease-out active:scale-[0.99]",
                selected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:bg-muted"
              )}
            >
              <span className="text-base font-medium">{option.label}</span>
              <span className="text-sm text-muted-foreground">{option.description}</span>
            </button>
          );
        })}
      </div>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
