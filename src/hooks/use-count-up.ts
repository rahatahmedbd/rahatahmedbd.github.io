"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "./use-in-view";

const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

function toBengali(n: number | string) {
  return String(n)
    .split("")
    .map((c) => {
      const d = Number(c);
      return Number.isNaN(d) ? c : bengaliDigits[d];
    })
    .join("");
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** Animated 0 → target counting, language-aware (Bengali / English digits). */
export function useCountUp(target: number, lang: "bn" | "en", duration = 1800) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.4 });
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setValue(target);
      return;
    }

    let raf = 0;
    let startTime: number | null = null;

    const step = (ts: number) => {
      if (startTime === null) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setValue(Math.floor(target * easeOutCubic(progress)));
      if (progress < 1) raf = requestAnimationFrame(step);
      else setValue(target);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  const display = lang === "bn" ? toBengali(value) : String(value);
  return { ref, display } as const;
}
