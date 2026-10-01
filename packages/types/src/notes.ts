export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  userId?: string;
}

export interface GenerateNoteRequest {
  prompt: string;
  intent?: string;
}
