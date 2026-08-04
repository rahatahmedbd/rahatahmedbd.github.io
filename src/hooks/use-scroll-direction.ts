"use client";

import { useEffect, useState } from "react";

export interface ScrollState {
  /** True once the page is scrolled past `offset`. */
  scrolled: boolean;
  /** True when the bar should hide (scrolling down, past the reveal zone). */
  hidden: boolean;
  /** 0 → 1 progress through the whole document. */
  progress: number;
}

/**
 * One scroll listener powering the smart navbar, the journey progress bar and
 * the back-to-top ring. Consolidated so the page never registers three
 * competing rAF loops.
 */
export function useScrollState(offset = 12, tolerance = 8): ScrollState {
  const [state, setState] = useState<ScrollState>({
    scrolled: false,
    hidden: false,
    progress: 0,
  });

  useEffect(() => {
    let ticking = false;
    let lastY = window.scrollY;

    const read = () => {
      const y = Math.max(window.scrollY, 0);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const delta = y - lastY;

      setState((prev) => {
        let hidden = prev.hidden;
        if (Math.abs(delta) > tolerance) {
          // Never hide near the very top — the bar must always be reachable.
          hidden = delta > 0 && y > 220;
          lastY = y;
        }
        const progress = max > 0 ? Math.min(y / max, 1) : 0;
        const scrolled = y > offset;
        if (
          prev.hidden === hidden &&
          prev.scrolled === scrolled &&
          Math.abs(prev.progress - progress) < 0.002
        ) {
          return prev;
        }
        return { hidden, scrolled, progress };
      });
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [offset, tolerance]);

  return state;
}
