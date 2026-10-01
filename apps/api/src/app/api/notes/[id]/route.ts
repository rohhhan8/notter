import type { UpdateNoteRequest } from "@notter/types";
import { getNoteById, updateNote, deleteNote } from "@/features/notes/crud-service";
import { errorResponse, handleApiError } from "@/lib/api-response";

export const runtime = "nodejs";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const note = await getNoteById(id);
    if (!note) {
      return errorResponse("Note not found", 404);
    }
    return Response.json({ note }, { status: 200, headers: corsHeaders });
  } catch (error) {
    return handleApiError(error, 400);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as UpdateNoteRequest;
    const note = await updateNote(id, body);
    return Response.json({ note }, { status: 200, headers: corsHeaders });
  } catch (error) {
    return handleApiError(error, 400);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteNote(id);
    return Response.json({ success: true }, { status: 200, headers: corsHeaders });
  } catch (error) {
    return handleApiError(error, 400);
  }
}
