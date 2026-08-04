"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import { useBodyLock } from "@/hooks/use-body-lock";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  /** Optional sticky footer (primary action). */
  footer?: ReactNode;
  className?: string;
}

/**
 * Mobile-native bottom sheet: drag the grabber down to dismiss, tap the
 * backdrop, or press Escape. On >= sm it becomes a centred modal card so the
 * same component serves both breakpoints.
 */
export function BottomSheet({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: BottomSheetProps) {
  const [dragY, setDragY] = useState(0);
  const dragging = useRef(false);
  const startY = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);

  useBodyLock(open);

  useEffect(() => {
    if (!open) return;
    setDragY(0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    startY.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const delta = e.clientY - startY.current;
    setDragY(delta > 0 ? delta : delta / 6);
  }, []);

  const onPointerUp = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    const height = panelRef.current?.offsetHeight ?? 400;
    // Read the committed value rather than mutating state inside an updater —
    // side effects in a state updater run twice under StrictMode.
    if (dragY > Math.min(140, height * 0.28)) onClose();
    setDragY(0);
  }, [dragY, onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[80] sm:grid sm:place-items-center sm:p-6",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0"
        )}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal={open}
        className={cn(
          "absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-4xl border border-border/10 bg-canvas shadow-lift",
          "sm:relative sm:mx-auto sm:max-h-[85dvh] sm:w-full sm:max-w-lg sm:rounded-4xl",
          "transition-transform duration-400 ease-premium will-change-transform",
          open ? "translate-y-0" : "translate-y-full sm:translate-y-6 sm:opacity-0",
          className
        )}
        style={dragY !== 0 ? { transform: `translateY(${dragY}px)` } : undefined}
      >
        {/* Grabber — the whole header area is draggable on touch */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="shrink-0 cursor-grab touch-none select-none px-5 pt-3 active:cursor-grabbing sm:cursor-default"
        >
          <span className="mx-auto block h-1.5 w-11 rounded-full bg-border/25 sm:hidden" />
          {(title || description) && (
            <div className="flex items-start justify-between gap-4 pb-3 pt-3">
              <div className="min-w-0">
                {title ? (
                  <h2 className="text-base font-bold tracking-tight text-fg sm:text-lg">
                    {title}
                  </h2>
                ) : null}
                {description ? (
                  <p className="mt-1 text-xs leading-relaxed text-fg-soft sm:text-sm">
                    {description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border/12 text-fg-muted transition-colors hover:bg-canvas-muted hover:text-fg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5">
          {children}
        </div>

        {footer ? (
          <div className="shrink-0 border-t border-border/10 bg-canvas/95 px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur sm:pb-4">
            {footer}
          </div>
        ) : (
          <div className="pb-[env(safe-area-inset-bottom)]" />
        )}
      </div>
    </div>
  );
}
