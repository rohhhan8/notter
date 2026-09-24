import { cn } from "@/lib/utils";

interface WordmarkProps {
  className?: string;
}

export function Wordmark({ className }: WordmarkProps) {
  return (
    <span className={cn("font-wordmark font-extrabold tracking-tight lowercase", className)}>
      notter.
    </span>
  );
}
