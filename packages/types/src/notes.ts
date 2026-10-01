export type NoteMode =
  | "general"
  | "school"
  | "lecture"
  | "university"
  | "research"
  | "technical"
  | "meeting"
  | "idea";

export interface NoteSummary {
  id: string;
  title: string;
  mode?: NoteMode | string;
  userId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Note extends NoteSummary {
  document: Record<string, unknown>; // Canonical Tiptap JSONContent
  content?: string; // Optional legacy markdown fallback
}

export interface CreateNoteRequest {
  title?: string;
  document?: Record<string, unknown>;
  content?: string;
  mode?: NoteMode | string;
}

export interface UpdateNoteRequest {
  title?: string;
  document?: Record<string, unknown>;
  content?: string;
  mode?: NoteMode | string;
}

export interface NotesListResponse {
  notes: NoteSummary[];
}

export interface NoteResponse {
  note: Note;
}

export type UserPlan = "free" | "pro";

export interface PlanLimits {
  maxInputCharacters: number;
  maxOutputTokens: number;
}

export interface GenerateNoteRequest {
  prompt: string;
  intent?: string;
  mode?: NoteMode | string;
}

export interface GenerateNoteResponse {
  document: Record<string, unknown>;
  title: string;
  mode: NoteMode;
  plan: UserPlan;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    durationMs?: number;
  };
}
