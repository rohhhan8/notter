import type { ReactNode } from "react";

interface MacWindowProps {
  title: string;
  children: ReactNode;
}

export function MacWindow({ title, children }: MacWindowProps) {
  return (
    <div className="flex h-[440px] w-[560px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1F1F1F] shadow-2xl shadow-black/40">
      <div className="flex shrink-0 items-center gap-2 border-b border-white/10 bg-[#272727] px-4 py-3">
        <div className="flex shrink-0 gap-1.5">
          <span className="size-3 rounded-full bg-[#FF5F57]" />
          <span className="size-3 rounded-full bg-[#FEBC2E]" />
          <span className="size-3 rounded-full bg-[#28C840]" />
        </div>
        <span className="flex-1 truncate text-center text-xs font-medium text-white/50">{title}</span>
        <div className="w-[52px] shrink-0" aria-hidden />
      </div>
      <div className="flex min-h-0 flex-1">{children}</div>
    </div>
  );
}
