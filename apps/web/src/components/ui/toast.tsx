"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Toast {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  description?: string;
}

interface ToastContextValue {
  toast: (options: Omit<Toast, "id">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let globalToastHandler: ((options: Omit<Toast, "id">) => void) | null = null;

export const toast = {
  success: (title: string, description?: string) => globalToastHandler?.({ type: "success", title, description }),
  error: (title: string, description?: string) => globalToastHandler?.({ type: "error", title, description }),
  info: (title: string, description?: string) => globalToastHandler?.({ type: "info", title, description }),
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((options: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    const newToast: Toast = { id, ...options };
    setToasts((prev) => [...prev, newToast]);

    window.setTimeout(() => {
      removeToast(id);
    }, 3500);
  }, [removeToast]);

  useEffect(() => {
    globalToastHandler = addToast;
    return () => {
      globalToastHandler = null;
    };
  }, [addToast]);

  const value: ToastContextValue = {
    toast: addToast,
    success: (title, description) => addToast({ type: "success", title, description }),
    error: (title, description) => addToast({ type: "error", title, description }),
    info: (title, description) => addToast({ type: "info", title, description }),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:bottom-6 z-[9999] flex flex-col items-center sm:items-end gap-2 pointer-events-none sm:max-w-sm"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            role="status"
            className={cn(
              "pointer-events-auto flex w-full sm:w-auto items-center gap-2.5 rounded-xl border border-border bg-card/95 px-3.5 py-2.5 text-card-foreground shadow-lg backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-bottom-2",
              item.type === "success" && "border-emerald-500/25 bg-card/95",
              item.type === "error" && "border-destructive/30 bg-card/95",
              item.type === "info" && "border-border bg-card/95",
            )}
          >
            {item.type === "success" && (
              <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
            )}
            {item.type === "error" && (
              <AlertCircle className="size-4 shrink-0 text-destructive" />
            )}
            {item.type === "info" && (
              <Info className="size-4 shrink-0 text-muted-foreground" />
            )}

            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-foreground truncate sm:whitespace-normal">
                {item.title}
              </p>
              {item.description ? (
                <p className="mt-0.5 text-[11px] sm:text-xs text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => removeToast(item.id)}
              className="size-5 shrink-0 flex items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-muted cursor-pointer"
              aria-label="Dismiss toast"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return toast;
  }
  return context;
}
