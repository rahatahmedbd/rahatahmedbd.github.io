"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

/**
 * Rotating role headline. Reserves the height of the tallest item so nothing
 * shifts, and freezes on the first item when reduced motion is requested.
 */
export function RotatingText({
  items,
  interval = 2600,
  className,
}: {
  items: string[];
  interval?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || items.length < 2) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % items.length),
      interval
    );
    return () => window.clearInterval(id);
  }, [items.length, interval, reduced]);

  // Keep the index valid if the language switch changes the array length.
  useEffect(() => {
    if (index >= items.length) setIndex(0);
  }, [index, items.length]);

  return (
    <span
      className={cn("relative inline-grid align-bottom", className)}
      aria-live="polite"
    >
      {/* Invisible sizer — locks the box to the widest / tallest role. */}
      <span aria-hidden className="invisible col-start-1 row-start-1 whitespace-pre">
        {items.reduce((a, b) => (b.length > a.length ? b : a), "")}
      </span>
      {items.map((item, i) => (
        <span
          key={item}
          aria-hidden={i !== index}
          className={cn(
            "col-start-1 row-start-1 whitespace-pre transition-all duration-500 ease-premium",
            i === index
              ? "translate-y-0 opacity-100 blur-0"
              : "pointer-events-none -translate-y-2 opacity-0 blur-[2px]"
          )}
        >
          {item}
        </span>
      ))}
    </span>
  );
}
