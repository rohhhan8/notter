import type { NoteMode } from "@notter/types";

export type NoteDensity =
  | "concise"
  | "concise-structured"
  | "moderate"
  | "moderate-detailed"
  | "detailed"
  | "very-detailed";

export interface ModeOutputConfig {
  maxOutputTokens: number;
  density: NoteDensity;
}

export const MODE_OUTPUT_CONFIG: Record<NoteMode, ModeOutputConfig> = {
  general: {
    maxOutputTokens: 600,
    density: "concise",
  },
  idea: {
    maxOutputTokens: 900,
    density: "concise-structured",
  },
  meeting: {
    maxOutputTokens: 900,
    density: "concise-structured",
  },
  school: {
    maxOutputTokens: 1200,
    density: "moderate",
  },
  lecture: {
    maxOutputTokens: 1800,
    density: "moderate-detailed",
  },
  technical: {
    maxOutputTokens: 2500,
    density: "detailed",
  },
  university: {
    maxOutputTokens: 3000,
    density: "detailed",
  },
  research: {
    maxOutputTokens: 4000,
    density: "very-detailed",
  },
};

export const SUPPORTED_NOTE_MODES: NoteMode[] = [
  "general",
  "school",
  "lecture",
  "university",
  "research",
  "technical",
  "meeting",
  "idea",
];
