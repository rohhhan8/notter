import type { Note } from "@/features/home/data/mock-notes";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function NoteView({ note }: { note: Note }) {
  return (
    <article className="mx-auto w-full max-w-2xl">
      <p className="text-xs text-muted-foreground">{formatDate(note.createdAt)}</p>
      <h1 className="mt-1 font-heading text-2xl font-semibold tracking-tight text-balance">{note.title}</h1>
      <p className="mt-4 whitespace-pre-line text-[0.95rem] leading-7 text-foreground/90">{note.content}</p>
    </article>
  );
}
