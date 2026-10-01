import { authStorage } from "./storage";
import type { GenerateNoteRequest } from "@notter/types";

export interface NotesClientOptions {
  baseUrl: string;
}

export function createNotesClient({ baseUrl }: NotesClientOptions) {
  return {
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

      const response = await fetch(`${baseUrl}/api/notes/generate`, {
        method: "POST",
        headers,
        body: JSON.stringify({ prompt, intent, mode }),
        signal,
      });

      if (!response.ok) {
        let errorMessage = `Failed to generate note (status: ${response.status})`;
        try {
          const errorJson = await response.json();
          if (errorJson && errorJson.error) {
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
