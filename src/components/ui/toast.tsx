"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastTone = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
  duration: number;
}

interface ToastContextValue {
  toast: (input: {
    title: string;
    description?: string;
    tone?: ToastTone;
    duration?: number;
  }) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toneStyles: Record<ToastTone, { ring: string; icon: ReactNode; bar: string }> = {
  success: {
    ring: "ring-emerald-500/25",
    bar: "bg-emerald-500",
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
  },
  error: {
    ring: "ring-red-500/25",
    bar: "bg-red-500",
    icon: <XCircle className="h-5 w-5 text-red-500" />,
  },
  warning: {
    ring: "ring-amber-500/25",
    bar: "bg-amber-500",
    icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  },
  info: {
    ring: "ring-brand-500/25",
    bar: "bg-brand-500",
    icon: <Info className="h-5 w-5 text-brand-500" />,
  },
};

/**
 * Global, dependency-free toast system. Rendered once in the root layout so
 * any client component (order flow, copy buttons, contact form) can give
 * immediate feedback without owning its own inline banner.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: string) => {
    setToasts((list) => list.filter((entry) => entry.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback<ToastContextValue["toast"]>(
    ({ title, description, tone = "info", duration = 4200 }) => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `t-${Date.now()}-${Math.random().toString(16).slice(2)}`;

      setToasts((list) => [...list.slice(-2), { id, title, description, tone, duration }]);

      const timer = setTimeout(() => dismiss(id), duration);
      timers.current.set(id, timer);
      return id;
    },
    [dismiss]
  );

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((timer) => clearTimeout(timer));
      map.clear();
    };
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 top-3 z-[95] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-5 sm:top-5 sm:items-end sm:px-0"
      >
        {toasts.map((entry) => {
          const style = toneStyles[entry.tone];
          return (
            <div
              key={entry.id}
              role="status"
              className={cn(
                "pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-2xl border border-border/10 bg-surface/95 p-4 pr-11 shadow-lift ring-1 ring-inset backdrop-blur-xl",
                "animate-[toast-in_360ms_cubic-bezier(0.16,1,0.3,1)_both]",
                style.ring
              )}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0">{style.icon}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug text-fg">{entry.title}</p>
                  {entry.description ? (
                    <p className="mt-0.5 text-xs leading-relaxed text-fg-soft">
                      {entry.description}
                    </p>
                  ) : null}
                </div>
              </div>
              <button
                type="button"
                onClick={() => dismiss(entry.id)}
                aria-label="Dismiss notification"
                className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full text-fg-muted transition-colors hover:bg-canvas-muted hover:text-fg"
              >
                <X className="h-4 w-4" />
              </button>
              <span
                className={cn("absolute inset-x-0 bottom-0 h-0.5 origin-left", style.bar)}
                style={{
                  animation: `toast-bar ${entry.duration}ms linear both`,
                }}
              />
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

/** Safe in any client component — returns a no-op outside the provider. */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  return (
    ctx ?? {
      toast: () => "",
      dismiss: () => undefined,
    }
  );
}
