"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

interface RahatVerseFallbackProps {
  onRetry?: () => void;
  className?: string;
}

/**
 * Branded fallback for the RahatVerse 3D experience.
 *
 * Shown when WebGL is unavailable (pre-flight detection, Canvas
 * context-creation failure, or a lost context at runtime) instead of a
 * generic error message. Keeps the user on-brand and gives them an exit
 * to the Website Experience.
 */
export function RahatVerseFallback({ onRetry, className }: RahatVerseFallbackProps) {
  return (
    <div
      className={`flex min-h-full flex-col items-center justify-center gap-5 bg-[#0a0c12] p-8 text-center text-white ${
        className ?? ""
      }`}
    >
      <div className="text-6xl" aria-hidden="true">
        🏙️
      </div>
      <h2 className="text-2xl font-semibold tracking-tight">RahatVerse needs WebGL</h2>
      <p className="max-w-sm text-sm leading-relaxed text-white/60">
        The 3D city renders in your browser with WebGL. It looks like WebGL is disabled or
        unsupported on this device — try enabling hardware acceleration, updating your browser, or
        open the Website Experience to explore the same content.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        {onRetry ? (
          <Button onClick={onRetry} className="bg-[#22d3ee] text-black hover:bg-[#67e8f9]">
            Try Again
          </Button>
        ) : null}
        <Link href="/portfolio">
          <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
            Open Website Experience
          </Button>
        </Link>
      </div>
    </div>
  );
}
