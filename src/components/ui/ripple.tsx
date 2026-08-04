"use client";

import { useCallback, useRef, useState } from "react";

interface RippleSpec {
  id: number;
  x: number;
  y: number;
  size: number;
}

/**
 * Lightweight tap feedback. Returns props to spread on any positioned,
 * overflow-hidden element plus the ripple layer to render inside it.
 * Uses plain CSS animation — no library, no layout thrash.
 */
export function useRipple(color = "rgba(255,255,255,0.35)") {
  const [ripples, setRipples] = useState<RippleSpec[]>([]);
  const seq = useRef(0);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (typeof window !== "undefined") {
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
    }
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.6;
    const id = ++seq.current;
    setRipples((list) => [
      ...list.slice(-3),
      { id, x: e.clientX - rect.left - size / 2, y: e.clientY - rect.top - size / 2, size },
    ]);
    window.setTimeout(() => {
      setRipples((list) => list.filter((r) => r.id !== id));
    }, 600);
  }, []);

  const rippleLayer = (
    <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full animate-[ripple_600ms_ease-out_forwards]"
          style={{
            left: r.x,
            top: r.y,
            width: r.size,
            height: r.size,
            background: color,
          }}
        />
      ))}
    </span>
  );

  return { onPointerDown, rippleLayer } as const;
}
