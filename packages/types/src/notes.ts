export type NoteMode =
  | "general"
  | "school"
  | "lecture"
  | "university"
  | "research"
  | "technical"
  | "meeting"
  | "idea";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  userId?: string;
  mode?: NoteMode | string;
}

export interface GenerateNoteRequest {
  prompt: string;
  intent?: string;
  mode?: NoteMode | string;
}
