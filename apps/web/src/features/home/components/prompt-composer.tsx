"use client";

import {
  useState,
  useRef,
  useEffect,
  type FormEvent,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import {
  ArrowUp,
  Loader2,
  X,
  Sparkles,
  School,
  Presentation,
  GraduationCap,
  Microscope,
  Code2,
  Users,
  Lightbulb,
} from "lucide-react";
import type { NoteMode } from "@notter/types";
import { cn } from "@/lib/utils";
import { VoicePill } from "@/features/home/components/voice-pill";

export interface SlashCommand {
  key: NoteMode;
  command: string;
  label: string;
  description: string;
  icon: typeof Sparkles;
}

export const SLASH_COMMANDS: SlashCommand[] = [
  {
    key: "general",
    command: "/general",
    label: "General",
    description: "Anything",
    icon: Sparkles,
  },
  {
    key: "school",
    command: "/school",
    label: "School",
    description: "School-level learning",
    icon: School,
  },
  {
    key: "lecture",
    command: "/lecture",
    label: "Lecture",
    description: "Classroom/lecture notes",
    icon: Presentation,
  },
  {
    key: "university",
    command: "/university",
    label: "University",
    description: "University-level academic notes",
    icon: GraduationCap,
  },
  {
    key: "research",
    command: "/research",
    label: "Research",
    description: "Research/thesis material",
    icon: Microscope,
  },
  {
    key: "technical",
    command: "/technical",
    label: "Technical",
    description: "Programming/technical knowledge",
    icon: Code2,
  },
  {
    key: "meeting",
    command: "/meeting",
    label: "Meeting",
    description: "Work/meeting notes",
    icon: Users,
  },
  {
    key: "idea",
    command: "/idea",
    label: "Idea",
    description: "Ideas/brain dumps",
    icon: Lightbulb,
  },
];

interface PromptComposerProps {
  onSubmit: (prompt: string, mode?: NoteMode) => void;
  isGenerating?: boolean;
  className?: string;
  dropdownPosition?: "top" | "bottom";
}

export function PromptComposer({
  onSubmit,
  isGenerating,
  className,
  dropdownPosition = "bottom",
}: PromptComposerProps) {
  const [value, setValue] = useState("");
  const [activeMode, setActiveMode] = useState<SlashCommand | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuListRef = useRef<HTMLDivElement>(null);

  const filteredCommands = SLASH_COMMANDS.filter((cmd) => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return (
      cmd.command.toLowerCase().includes(q) ||
      cmd.label.toLowerCase().includes(q) ||
      cmd.description.toLowerCase().includes(q)
    );
  });

  const safeSelectedIndex = Math.min(selectedIndex, Math.max(0, filteredCommands.length - 1));

  // Auto-grow textarea height as content expands (ChatGPT style)
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const nextHeight = Math.min(textarea.scrollHeight, 220);
    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > 220 ? "auto" : "hidden";
  }, [value]);

  // Click outside to close slash menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelectCommand(cmd: SlashCommand) {
    setActiveMode(cmd);
    setIsMenuOpen(false);
    setFilterQuery("");
    setSelectedIndex(0);

    // Strip out the leading slash query if user typed it
    setValue((current) => current.replace(/^\/\S*\s*/, ""));
    textareaRef.current?.focus();
  }

  function handleInputChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const text = event.target.value;
    setValue(text);

    // If starts with slash and no active mode yet, show command menu
    if (!activeMode && text.startsWith("/")) {
      const match = text.match(/^\/(\S*)/);
      if (match) {
        setFilterQuery(match[1]);
        setSelectedIndex(0);
        setIsMenuOpen(true);
        return;
      }
    }

    if (isMenuOpen && !text.startsWith("/")) {
      setIsMenuOpen(false);
      setFilterQuery("");
      setSelectedIndex(0);
    }
  }

  function submit() {
    let trimmed = value.trim();
    if (!trimmed || isGenerating) return;

    let selectedMode = activeMode?.key;

    // Direct slash command detection in text if user didn't pick from menu
    if (!selectedMode && trimmed.startsWith("/")) {
      const commandMatch = trimmed.match(/^(\/[a-zA-Z]+)\s*(.*)$/);
      if (commandMatch) {
        const rawCmd = commandMatch[1].toLowerCase();
        const found = SLASH_COMMANDS.find((c) => c.command.toLowerCase() === rawCmd);
        if (found) {
          selectedMode = found.key;
          trimmed = commandMatch[2].trim();
        }
      }
    }

    if (!trimmed) return;

    onSubmit(trimmed, selectedMode);
    setValue("");
    setActiveMode(null);
    setIsMenuOpen(false);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    submit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    // If slash menu is open, handle navigation keys
    if (isMenuOpen && filteredCommands.length > 0) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        return;
      }
      if (event.key === "Enter" || event.key === "Tab") {
        event.preventDefault();
        const chosen = filteredCommands[safeSelectedIndex];
        if (chosen) {
          handleSelectCommand(chosen);
        }
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        setIsMenuOpen(false);
        return;
      }
    }

    // Backspace removes active mode pill if input is empty
    if (event.key === "Backspace" && !value && activeMode) {
      setActiveMode(null);
      return;
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  const ActiveIcon = activeMode?.icon;

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Slash Commands Dropdown Menu */}
      {isMenuOpen ? (
        <div
          role="listbox"
          aria-label="Slash commands"
          className={cn(
            "absolute left-0 w-full sm:w-80 md:w-96 rounded-2xl border border-border bg-card/95 p-1.5 shadow-2xl backdrop-blur-md z-50 animate-in fade-in duration-150",
            dropdownPosition === "top"
              ? "bottom-full mb-3 slide-in-from-bottom-2"
              : "top-full mt-3 slide-in-from-top-2"
          )}
        >
          <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-border/40 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Note Formats & Shortcuts
            </span>
            <span className="text-[10px] text-muted-foreground font-mono hidden sm:inline">
              ↑↓ navigate · ↵ select
            </span>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-0.5" ref={menuListRef}>
            {filteredCommands.length > 0 ? (
              filteredCommands.map((cmd, index) => {
                const Icon = cmd.icon;
                const isSelected = index === safeSelectedIndex;
                return (
                  <button
                    key={cmd.key}
                    type="button"
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => handleSelectCommand(cmd)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors cursor-pointer",
                      isSelected
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "hover:bg-muted text-foreground border border-transparent"
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold">{cmd.command}</span>
                        <span className="text-xs font-medium text-foreground/90">{cmd.label}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">{cmd.description}</p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-3 text-xs text-muted-foreground text-center">
                No matching command found
              </div>
            )}
          </div>
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="flex w-full items-end gap-2 rounded-3xl border border-border bg-card px-4 sm:px-5 py-3.5 sm:py-4 shadow-sm transition-shadow focus-within:shadow-md"
      >
        {/* Selected Mode Badge */}
        {activeMode && ActiveIcon ? (
          <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 pl-2.5 pr-1.5 py-1 text-xs font-semibold text-primary mb-1">
            <ActiveIcon className="size-3.5" />
            <span className="font-mono">{activeMode.command}</span>
            <button
              type="button"
              onClick={() => {
                setActiveMode(null);
                textareaRef.current?.focus();
              }}
              className="flex size-4 items-center justify-center rounded-full hover:bg-primary/20 text-primary/80 hover:text-primary transition-colors cursor-pointer"
              aria-label="Remove mode"
            >
              <X className="size-2.5" />
            </button>
          </div>
        ) : null}

        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={
            activeMode
              ? `Write your ${activeMode.label.toLowerCase()} note topic or prompt...`
              : "Ask anything, or type / for shortcuts..."
          }
          rows={1}
          disabled={isGenerating}
          className="min-w-0 max-h-56 flex-1 resize-none bg-transparent text-[0.95rem] leading-6 text-foreground outline-none placeholder:text-muted-foreground/80 pb-1.5 disabled:opacity-60"
        />

        <VoicePill />

        <button
          type="submit"
          disabled={!value.trim() || isGenerating}
          aria-label="Send"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-40 cursor-pointer"
        >
          {isGenerating ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <ArrowUp className="size-4" aria-hidden />
          )}
        </button>
      </form>
    </div>
  );
}
