"use client";

import { useEffect, useMemo, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

const COLORS = ["#f43f5e", "#fb7185", "#d4af37", "#34d399", "#38bdf8", "#a78bfa"];

/**
 * Success celebration. Pure CSS transforms on ~34 absolutely-positioned
 * spans — no canvas, no library, and it removes itself when finished.
 */
export function Confetti({ pieces = 34, duration = 1800 }: { pieces?: number; duration?: number }) {
  const [alive, setAlive] = useState(true);
  const reduced = usePrefersReducedMotion();

  const shards = useMemo(
    () =>
      Array.from({ length: pieces }).map((_, i) => {
        const angle = (Math.PI * (i / pieces)) - Math.PI / 2;
        const distance = 120 + Math.random() * 180;
        return {
          id: i,
          dx: `${Math.cos(angle) * distance * (Math.random() > 0.5 ? 1 : -1)}px`,
          dy: `${Math.abs(Math.sin(angle)) * distance + 60}px`,
          rot: `${Math.round((Math.random() - 0.5) * 720)}deg`,
          delay: Math.random() * 220,
          color: COLORS[i % COLORS.length],
          size: 6 + Math.round(Math.random() * 6),
          round: Math.random() > 0.6,
        };
      }),
    [pieces]
  );

  useEffect(() => {
    if (reduced) return setAlive(false);
    const timer = window.setTimeout(() => setAlive(false), duration + 400);
    return () => window.clearTimeout(timer);
  }, [duration, reduced]);

  if (!alive || reduced) return null;

  return (
    <span aria-hidden className="pointer-events-none absolute inset-x-0 top-8 z-10 mx-auto block h-0 w-0">
      {shards.map((s) => (
        <span
          key={s.id}
          className="absolute animate-[confetti_var(--dur)_cubic-bezier(0.16,1,0.3,1)_both]"
          style={
            {
              "--dx": s.dx,
              "--dy": s.dy,
              "--rot": s.rot,
              "--dur": `${duration}ms`,
              animationDelay: `${s.delay}ms`,
              width: s.size,
              height: s.size * (s.round ? 1 : 1.6),
              background: s.color,
              borderRadius: s.round ? "999px" : "2px",
            } as React.CSSProperties
          }
        />
      ))}
    </span>
  );
}
