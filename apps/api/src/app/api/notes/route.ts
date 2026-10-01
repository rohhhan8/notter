import type { CreateNoteRequest } from "@notter/types";
import { listNotes, createNote } from "@/features/notes/crud-service";
import { handleApiError } from "@/lib/api-response";

export const runtime = "nodejs";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET() {
  try {
    const notes = await listNotes();
    return Response.json({ notes }, { status: 200, headers: corsHeaders });
  } catch (error) {
    return handleApiError(error, 400);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateNoteRequest;
    const note = await createNote(body);
    return Response.json({ note }, { status: 201, headers: corsHeaders });
  } catch (error) {
    return handleApiError(error, 400);
  }
}
