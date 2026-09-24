export function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unexpected error";
}
