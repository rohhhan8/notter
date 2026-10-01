import { generateNoteStream } from "@/features/notes/service";
import type { GenerateNoteRequest } from "@notter/types";

export const runtime = "nodejs";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateNoteRequest;
    if (!body?.prompt || typeof body.prompt !== "string" || !body.prompt.trim()) {
      return Response.json(
        { error: "Prompt is required and must be a non-empty string" },
        { status: 400, headers: corsHeaders }
      );
    }

    const stream = await generateNoteStream({
      prompt: body.prompt.trim(),
      intent: body.intent,
      mode: body.mode,
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error generating note via Groq:", error);
    const message = error instanceof Error ? error.message : "Failed to generate note";
    return Response.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}
