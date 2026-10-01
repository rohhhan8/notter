import { authStorage } from "./storage";
import type {
  Note,
  NoteSummary,
  CreateNoteRequest,
  UpdateNoteRequest,
  NotesListResponse,
  NoteResponse,
  GenerateNoteRequest,
} from "@notter/types";

export interface NotesClientOptions {
  baseUrl: string;
}

function getAuthHeaders(): Record<string, string> {
  let authToken: string | undefined;
  if (typeof window !== "undefined") {
    const session = authStorage.get();
    authToken = session?.accessToken;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }
  return headers;
}

export function createNotesClient({ baseUrl }: NotesClientOptions) {
  return {
    async list(): Promise<NoteSummary[]> {
      const response = await fetch(`${baseUrl}/api/notes`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        let errorMsg = `Failed to list notes (status: ${response.status})`;
        try {
          const json = await response.json();
          if (json?.error) errorMsg = json.error;
        } catch {
          // ignore
        }
        throw new Error(errorMsg);
      }

      const data = (await response.json()) as NotesListResponse;
      return data.notes || [];
    },

    async get(id: string): Promise<Note> {
      const response = await fetch(`${baseUrl}/api/notes/${encodeURIComponent(id)}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        let errorMsg = `Failed to get note (status: ${response.status})`;
        try {
          const json = await response.json();
          if (json?.error) errorMsg = json.error;
        } catch {
          // ignore
        }
        throw new Error(errorMsg);
      }

      const data = (await response.json()) as NoteResponse;
      return data.note;
    },

    async create(payload: CreateNoteRequest): Promise<Note> {
      const response = await fetch(`${baseUrl}/api/notes`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMsg = `Failed to create note (status: ${response.status})`;
        try {
          const json = await response.json();
          if (json?.error) errorMsg = json.error;
        } catch {
          // ignore
        }
        throw new Error(errorMsg);
      }

      const data = (await response.json()) as NoteResponse;
      return data.note;
    },

    async update(id: string, payload: UpdateNoteRequest): Promise<Note> {
      const response = await fetch(`${baseUrl}/api/notes/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMsg = `Failed to update note (status: ${response.status})`;
        try {
          const json = await response.json();
          if (json?.error) errorMsg = json.error;
        } catch {
          // ignore
        }
        throw new Error(errorMsg);
      }

      const data = (await response.json()) as NoteResponse;
      return data.note;
    },

    async delete(id: string): Promise<void> {
      const response = await fetch(`${baseUrl}/api/notes/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        let errorMsg = `Failed to delete note (status: ${response.status})`;
        try {
          const json = await response.json();
          if (json?.error) errorMsg = json.error;
        } catch {
          // ignore
        }
        throw new Error(errorMsg);
      }
    },

    async generate(payload: GenerateNoteRequest): Promise<{ note: Note; usage?: Record<string, unknown> }> {
      const response = await fetch(`${baseUrl}/api/notes/generate`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = `Failed to generate note (status: ${response.status})`;
        try {
          const errorJson = await response.json();
          if (errorJson?.error) {
            errorMessage = errorJson.error;
          }
        } catch {
          // ignore
        }
        throw new Error(errorMessage);
      }

      return (await response.json()) as { note: Note; usage?: Record<string, unknown> };
    },

    async generateStream({
      prompt,
      intent,
      mode,
      onDelta,
      signal,
    }: GenerateNoteRequest & {
      onDelta: (delta: string) => void;
      signal?: AbortSignal;
    }): Promise<string> {
      const response = await fetch(`${baseUrl}/api/notes/generate?stream=true`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ prompt, intent, mode }),
        signal,
      });

      if (!response.ok) {
        let errorMessage = `Failed to generate note (status: ${response.status})`;
        try {
          const errorJson = await response.json();
          if (errorJson?.error) {
            errorMessage = errorJson.error;
          }
        } catch {
          // ignore json parse error
        }
        throw new Error(errorMessage);
      }

      if (!response.body) {
        throw new Error("No response body received from server");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        fullContent += text;
        onDelta(text);
      }

      return fullContent;
    },
  };
}
