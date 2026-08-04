"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useBodyLock } from "@/hooks/use-body-lock";
import { cn } from "@/lib/utils";

export interface LightboxItem {
  src: string;
  alt: string;
  title?: string;
  meta?: string;
}

interface LightboxProps {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (next: number) => void;
}

/**
 * Premium image viewer: keyboard arrows, swipe on touch, counter, and a
 * caption bar. Deliberately CSS-only (no animation library) so it costs
 * almost nothing on mobile.
 */
export function Lightbox({ items, index, onClose, onIndexChange }: LightboxProps) {
  const open = index !== null && index >= 0 && index < items.length;
  const [loaded, setLoaded] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useBodyLock(open);

  const go = useCallback(
    (dir: -1 | 1) => {
      if (index === null || items.length === 0) return;
      const next = (index + dir + items.length) % items.length;
      setLoaded(false);
      onIndexChange(next);
    },
    [index, items.length, onIndexChange]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, go]);

  useEffect(() => setLoaded(false), [index]);

  if (!open || index === null) return null;
  const item = items[index];

  return (
    <div
      className="fixed inset-0 z-[90] flex flex-col bg-black/92 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={item.title || item.alt}
      onTouchStart={(e) => {
        touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }}
      onTouchEnd={(e) => {
        const start = touchStart.current;
        touchStart.current = null;
        if (!start) return;
        const dx = e.changedTouches[0].clientX - start.x;
        const dy = e.changedTouches[0].clientY - start.y;
        if (Math.abs(dy) > Math.abs(dx) && dy > 90) return onClose();
        if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
      }}
    >
      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-between px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3 text-white">
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tabular-nums">
          {index + 1} / {items.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Stage */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 sm:px-16">
        {items.length > 1 && (
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous image"
            className="absolute left-2 z-10 hidden h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:grid"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {!loaded && (
          <div className="absolute inset-8 animate-pulse rounded-3xl bg-white/5" />
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={item.src}
          src={item.src}
          alt={item.alt}
          onLoad={() => setLoaded(true)}
          className={cn(
            "max-h-full max-w-full rounded-2xl object-contain shadow-2xl transition-opacity duration-300",
            loaded ? "opacity-100" : "opacity-0"
          )}
        />

        {items.length > 1 && (
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next image"
            className="absolute right-2 z-10 hidden h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:grid"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Caption */}
      <div className="shrink-0 px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4 text-center text-white">
        {item.title ? <p className="text-sm font-bold">{item.title}</p> : null}
        {item.meta ? <p className="mt-0.5 text-xs text-white/60">{item.meta}</p> : null}
        {items.length > 1 && (
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {items.map((entry, i) => (
              <button
                key={entry.src}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                onClick={() => onIndexChange(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === index ? "w-6 bg-white" : "w-1.5 bg-white/35 hover:bg-white/60"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
