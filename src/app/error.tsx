"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    // Log the error to console/monitoring
    console.error("System crash capture:", error);
  }, [error]);

  return (
    <div className="relative min-h-[85vh] overflow-hidden flex items-center justify-center py-20">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="absolute inset-0 bg-grid-faint [background-size:64px_64px] opacity-[0.35] mask-fade-b [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-600/10 blur-[120px]" />
        <div className="absolute -right-20 top-40 h-72 w-72 rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <div className="mx-auto w-full max-w-md px-5 text-center flex flex-col items-center">
        <Reveal direction="scale">
          <div className="relative mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft">
            <AlertTriangle className="h-10 w-10 animate-bounce" />
            <div className="absolute -inset-2 -z-10 rounded-3xl bg-brand-600/15 blur-lg" />
          </div>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="text-display-md font-bold tracking-tight mb-2">
            <span className="text-gradient">
              {t({
                bn: "সিস্টেম ত্রুটি ঘটেছে",
                en: "Something Went Wrong",
              })}
            </span>
          </h1>
          <p className="text-sm font-mono text-brand-500 uppercase tracking-widest mb-4">
            {t({
              bn: "ত্রুটি ৫০০ / সার্ভার সমস্যা",
              en: "Error 500 / Server Error",
            })}
          </p>
        </Reveal>

        <Reveal delay={140}>
          <p className="text-pretty text-sm leading-relaxed text-fg-soft mb-8">
            {t({
              bn: "একটি অভ্যন্তরীণ ত্রুটি ঘটেছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন অথবা সমস্যাটি দীর্ঘস্থায়ী হলে আমাদের জানান।",
              en: "An unexpected system-level transaction error occurred. Please try reloading the page, or reach out to support if the issue persists.",
            })}
          </p>
        </Reveal>

        <Reveal delay={200}>
          <div className="flex gap-4">
            <Button href="/" variant="secondary" className="px-6 h-11">
              {t({ bn: "হোমে ফিরে যান", en: "Back to Home" })}
            </Button>
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 text-white font-bold h-11 px-6 shadow-soft hover:bg-brand-500 transition-all duration-300"
            >
              <RefreshCcw className="h-4 w-4" />
              {t({
                bn: "আবার চেষ্টা করুন",
                en: "Try Again",
              })}
            </button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
