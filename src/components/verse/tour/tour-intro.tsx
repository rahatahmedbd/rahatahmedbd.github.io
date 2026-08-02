"use client";

import { useEffect, useState } from "react";
import { Car, Loader2, Play, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { DISTRICTS } from "./districts";
import { cn } from "@/lib/utils";

/**
 * The gate sequence. Shown while the city compiles in the background, and
 * dismissed by the visitor "boarding" the pod — which also unlocks audio
 * (browsers require a gesture).
 */
export function TourIntro({
  ready,
  onBoard,
}: {
  ready: boolean;
  onBoard: () => void;
}) {
  const { t } = useLanguage();
  const [leaving, setLeaving] = useState(false);

  const board = () => {
    setLeaving(true);
    window.setTimeout(onBoard, 700);
  };

  /* Enter also boards. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === " ") && ready) board();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-hidden bg-[#04070f] px-5 text-white transition-all duration-700",
        leaving ? "pointer-events-none scale-105 opacity-0" : "opacity-100"
      )}
    >
      {/* Gate visuals */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/20 blur-[150px]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-cyan-500/10 to-transparent" />
        <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(to_right,rgba(125,211,252,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(125,211,252,0.5)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(60%_60%_at_50%_55%,black,transparent)]" />

        {/* Arch */}
        <svg
          viewBox="0 0 400 260"
          className="absolute left-1/2 top-1/2 w-[min(90vw,640px)] -translate-x-1/2 -translate-y-[58%] text-brand-500/45"
          fill="none"
        >
          <path d="M40 260V120a160 160 0 0 1 320 0v140" stroke="currentColor" strokeWidth="3" />
          <path d="M70 260V125a130 130 0 0 1 260 0v135" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          {[0, 1, 2, 3].map((i) => (
            <line
              key={i}
              x1="40"
              x2="360"
              y1={200 - i * 34}
              y2={200 - i * 34}
              stroke="currentColor"
              strokeWidth="1"
              opacity={0.25 - i * 0.05}
            />
          ))}
        </svg>
      </div>

      <div className="relative flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-white/60 backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-brand-400" />
          {t({ en: "RahatVerse · Guided city tour", bn: "রাহাতভার্স · গাইডেড সিটি ট্যুর" })}
        </span>

        <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-6xl">
          {t({ en: "Welcome to RahatVerse", bn: "রাহাতভার্সে স্বাগতম" })}
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-pretty text-sm leading-relaxed text-white/55 sm:text-base">
          {t({
            en: "Board the pod and it will drive you through the whole city on its own — stopping at every district so you can read, browse and order without touching a control.",
            bn: "ভেহিকেলে উঠুন — সেটি নিজেই পুরো শহর ঘুরিয়ে দেখাবে। প্রতিটি এলাকায় থামবে, যেন আপনি পড়তে, দেখতে ও অর্ডার করতে পারেন কোনো কিছু নিয়ন্ত্রণ না করেই।",
          })}
        </p>

        {/* Stop preview */}
        <div className="mt-7 flex max-w-lg flex-wrap items-center justify-center gap-1.5">
          {DISTRICTS.map((d) => (
            <span
              key={d.id}
              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-white/55"
            >
              <span>{d.emoji}</span>
              {t(d.name)}
            </span>
          ))}
        </div>

        <button
          type="button"
          disabled={!ready}
          onClick={board}
          className={cn(
            "group mt-9 inline-flex h-14 items-center gap-3 rounded-full px-9 text-base font-bold transition-all duration-300",
            ready
              ? "bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-[0_20px_50px_-20px_rgba(244,63,94,1)] hover:scale-105"
              : "cursor-wait border border-white/15 bg-white/5 text-white/40"
          )}
        >
          {ready ? (
            <>
              <Car className="h-5 w-5" />
              {t({ en: "Board the pod", bn: "ভেহিকেলে উঠুন" })}
              <Play className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          ) : (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              {t({ en: "Building the city…", bn: "শহর তৈরি হচ্ছে…" })}
            </>
          )}
        </button>

        <p className="mt-4 text-[11px] text-white/30">
          {t({
            en: "Same information as the website — just a different way to receive it.",
            bn: "ওয়েবসাইটের একই তথ্য — শুধু উপস্থাপনা ভিন্ন।",
          })}
        </p>
      </div>
    </div>
  );
}
