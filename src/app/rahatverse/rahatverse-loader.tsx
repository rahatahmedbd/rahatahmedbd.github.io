"use client";

import dynamic from "next/dynamic";

/**
 * The RahatVerse scene pulls in the three.js runtime (~900 KB of JavaScript).
 * It is loaded lazily and client-only so the initial HTML stays tiny, first
 * paint is instant, and the heavy module never blocks hydration of the rest
 * of the platform.
 */
const RahatVerseScene = dynamic(() => import("./rahatverse-scene"), {
  ssr: false,
  loading: () => (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-[#0a0c12] text-white"
      role="status"
      aria-live="polite"
    >
      <div className="text-4xl" aria-hidden="true">
        🏙️
      </div>
      <p className="text-sm text-white/70">Preparing the RahatVerse city…</p>
    </div>
  ),
});

export function RahatVerseLoader() {
  return <RahatVerseScene />;
}
