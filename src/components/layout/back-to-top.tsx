"use client";

import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";
import { useScrollState } from "@/hooks/use-scroll-direction";
import { cn } from "@/lib/utils";

const SIZE = 46;
const STROKE = 2.5;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Back-to-top with a reading-progress ring. Sits above the mobile bottom
 * navigation and inside the safe area on both breakpoints.
 */
export function BackToTop() {
  const { progress } = useScrollState(12);
  const pathname = usePathname();
  const visible = progress > 0.12;

  /* The order route replaces the bottom navigation with its own, slightly
     taller, summary + submit bar — lift the ring clear of it. */
  const raised = pathname.startsWith("/order");

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        })
      }
      className={cn(
        "press fixed right-4 z-[56] grid place-items-center rounded-full border border-border/15 bg-surface/85 text-fg shadow-lift backdrop-blur transition-all duration-400 ease-premium hover:border-brand-500/40",
        // Clear the mobile bottom bar; drop back down on large screens.
        raised
          ? "bottom-[calc(6.25rem+env(safe-area-inset-bottom))]"
          : "bottom-[calc(5.5rem+env(safe-area-inset-bottom))]",
        "lg:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] lg:right-6",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      )}
      style={{ width: SIZE, height: SIZE }}
    >
      <svg
        aria-hidden
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="absolute inset-0 -rotate-90"
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          className="stroke-border/15"
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          strokeLinecap="round"
          className="stroke-brand-500 transition-[stroke-dashoffset] duration-150 ease-out"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
        />
      </svg>
      <ArrowUp className="relative h-[18px] w-[18px]" />
    </button>
  );
}
