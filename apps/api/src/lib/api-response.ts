export function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

interface SupabaseLikeError {
  message: string;
  code?: string;
  status?: number;
  hint?: string;
  details?: string;
}

function isSupabaseLikeError(error: unknown): error is SupabaseLikeError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  );
}

// Maps known Postgres/PostgREST/Supabase Auth error codes to a message safe
// to show a user. Anything not listed here falls back to the raw message
// (still logged in full server-side via logError) rather than a generic
// "Something went wrong" that hides what actually happened.
const KNOWN_ERROR_MESSAGES: Record<string, string> = {
  "23505": "That value is already taken. Try a different one.",
  "42501": "The server isn't allowed to do that yet (permission denied). This is a configuration issue, not something you did wrong.",
  user_already_exists: "An account with that email already exists.",
  invalid_credentials: "That email or password is incorrect.",
  email_not_confirmed: "Please confirm your email before signing in.",
  weak_password: "That password is too weak. Try a longer or more varied one.",
  over_email_send_rate_limit: "Too many attempts. Wait a moment and try again.",
};

// HTTP status to respond with for known error codes. Falls back to
// `fallbackStatus` (the status the caller expected for the "normal" failure
// case, e.g. 400 for bad input) when the code isn't mapped here.
const KNOWN_ERROR_STATUS: Record<string, number> = {
  "23505": 409,
  "42501": 500,
  user_already_exists: 409,
  invalid_credentials: 401,
  email_not_confirmed: 401,
  over_email_send_rate_limit: 429,
};

/**
 * Logs the full error (so Postgres/Supabase `code`/`hint`/`details` — the
 * actually useful fields — show up in server logs, not just `.message`) and
 * returns a JSON error response with a specific message and status code
 * when the error is a recognized Postgres/PostgREST/Supabase Auth error.
 */
export function handleApiError(error: unknown, fallbackStatus = 400) {
  console.error(error);

  if (isSupabaseLikeError(error) && error.code && error.code in KNOWN_ERROR_MESSAGES) {
    return errorResponse(KNOWN_ERROR_MESSAGES[error.code], KNOWN_ERROR_STATUS[error.code] ?? fallbackStatus);
  }

  return errorResponse(toErrorMessage(error), fallbackStatus);
}

export function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (isSupabaseLikeError(error)) return error.message;
  return "Unexpected error";
}
