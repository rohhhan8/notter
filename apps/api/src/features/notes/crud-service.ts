import type { Note, NoteSummary, CreateNoteRequest, UpdateNoteRequest, NoteMode } from "@notter/types";
import { getSupabaseForRequest } from "@/lib/supabase";

interface NoteSummaryRow {
  id: string;
  user_id: string;
  title: string;
  mode: string;
  created_at: string;
  updated_at: string;
}

interface NoteRow extends NoteSummaryRow {
  document: Record<string, unknown>;
}

function toNoteSummary(row: NoteSummaryRow): NoteSummary {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    mode: row.mode as NoteMode,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toNote(row: NoteRow): Note {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    document: row.document,
    content: typeof row.document === "string" ? row.document : undefined,
    mode: row.mode as NoteMode,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listNotes(): Promise<NoteSummary[]> {
  const supabase = await getSupabaseForRequest();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase
    .from("notes")
    .select("id, user_id, title, mode, created_at, updated_at")
    .eq("user_id", userData.user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error listing notes:", error);
    throw error;
  }

  return (data as NoteSummaryRow[]).map(toNoteSummary);
}

export async function getNoteById(id: string): Promise<Note | null> {
  const supabase = await getSupabaseForRequest();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching note ${id}:`, error);
    throw error;
  }

  return data ? toNote(data as NoteRow) : null;
}

export async function createNote(payload: CreateNoteRequest): Promise<Note> {
  const supabase = await getSupabaseForRequest();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw new Error("Not authenticated");
  }

  const initialDocument = payload.document || {
    type: "doc",
    content: [{ type: "paragraph" }],
  };

  const { data, error } = await supabase
    .from("notes")
    .insert({
      user_id: userData.user.id,
      title: payload.title?.trim() || "Untitled Note",
      document: initialDocument,
      mode: payload.mode || "general",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating note:", error);
    throw error;
  }

  return toNote(data as NoteRow);
}

export async function updateNote(id: string, payload: UpdateNoteRequest): Promise<Note> {
  const supabase = await getSupabaseForRequest();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw new Error("Not authenticated");
  }

  const updates: Record<string, unknown> = {};

  if (payload.title !== undefined) {
    const trimmed = payload.title.trim();
    if (!trimmed) throw new Error("Title cannot be empty");
    updates.title = trimmed;
  }

  if (payload.document !== undefined) {
    updates.document = payload.document;
  }

  if (payload.mode !== undefined) {
    updates.mode = payload.mode;
  }

  if (Object.keys(updates).length === 0) {
    const existing = await getNoteById(id);
    if (!existing) throw new Error("Note not found");
    return existing;
  }

  const { data, error } = await supabase
    .from("notes")
    .update(updates)
    .eq("id", id)
    .eq("user_id", userData.user.id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating note ${id}:`, error);
    throw error;
  }

  return toNote(data as NoteRow);
}

export async function deleteNote(id: string): Promise<void> {
  const supabase = await getSupabaseForRequest();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id)
    .eq("user_id", userData.user.id);

  if (error) {
    console.error(`Error deleting note ${id}:`, error);
    throw error;
  }
}
