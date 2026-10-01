import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Note } from "@/features/home/data/mock-notes";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function escapeRegex(string: string) {
  return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");
}

export function NoteView({ note, isStreaming }: { note: Note; isStreaming?: boolean }) {
  // Strip the leading '# Title' from the markdown body if already displayed in the main header
  let displayContent = note.content;
  if (note.title) {
    const titleRegex = new RegExp(`^#\\s+${escapeRegex(note.title)}\\s*\\n*`, "i");
    displayContent = displayContent.replace(titleRegex, "");
  }

  return (
    <article className="mx-auto w-full max-w-2xl pb-16">
      <div className="flex items-center gap-2.5">
        <p className="text-xs font-medium text-muted-foreground">{formatDate(note.createdAt)}</p>
        {note.mode ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-primary">
            /{note.mode}
          </span>
        ) : null}
      </div>
      <h1 className="mt-2 font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-balance">
        {note.title}
      </h1>

      <div className="mt-6 text-[0.95rem] leading-7 text-foreground/90">
        {displayContent ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h2 className="mt-8 mb-3 text-xl font-bold text-foreground border-b border-border/50 pb-1.5">
                  {children}
                </h2>
              ),
              h2: ({ children }) => (
                <h2 className="mt-7 mb-2.5 text-lg font-semibold text-foreground border-b border-border/40 pb-1">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="mt-5 mb-2 text-base font-semibold text-foreground">
                  {children}
                </h3>
              ),
              p: ({ children }) => <p className="leading-7 my-3">{children}</p>,
              ul: ({ children }) => <ul className="my-3 ml-5 list-disc space-y-1.5">{children}</ul>,
              ol: ({ children }) => <ol className="my-3 ml-5 list-decimal space-y-1.5">{children}</ol>,
              li: ({ children }) => <li className="my-0.5 leading-6">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className="my-4 border-l-2 border-primary/70 bg-muted/40 px-4 py-2.5 italic text-muted-foreground rounded-r-lg text-sm">
                  {children}
                </blockquote>
              ),
              code: ({ className, children }) => {
                const isBlock = className?.includes("language-");
                if (isBlock) {
                  return (
                    <code className="block my-3 overflow-x-auto rounded-xl border border-border/60 bg-muted/50 p-4 font-mono text-xs text-foreground">
                      {children}
                    </code>
                  );
                }
                return (
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                    {children}
                  </code>
                );
              },
              input: ({ type, checked, disabled, ...props }) => {
                if (type === "checkbox") {
                  return (
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      readOnly
                      className="mr-2 h-3.5 w-3.5 rounded border-border accent-primary align-middle"
                      {...props}
                    />
                  );
                }
                return <input type={type} {...props} />;
              },
            }}
          >
            {displayContent}
          </ReactMarkdown>
        ) : null}

        {isStreaming ? (
          <span className="inline-block h-4 w-1.5 ml-1 animate-pulse bg-primary align-middle rounded-xs" />
        ) : null}
      </div>
    </article>
  );
}
