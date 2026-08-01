"use client";

import { Compass, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export default function NotFoundPage() {
  const { t } = useLanguage();

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
            <Compass className="h-10 w-10 animate-spin" style={{ animationDuration: "10s" }} />
            <div className="absolute -inset-2 -z-10 rounded-3xl bg-brand-600/15 blur-lg" />
          </div>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="text-display-md font-bold tracking-tight mb-2">
            <span className="text-gradient">
              {t({
                bn: "পাতাটি খুঁজে পাওয়া যায়নি",
                en: "Page Not Found",
              })}
            </span>
          </h1>
          <p className="text-sm font-mono text-brand-500 uppercase tracking-widest mb-4">
            {t({
              bn: "ত্রুটি ৪০৪ / হারিয়ে গেছেন?",
              en: "Error 404 / Lost in space?",
            })}
          </p>
        </Reveal>

        <Reveal delay={140}>
          <p className="text-pretty text-sm leading-relaxed text-fg-soft mb-8">
            {t({
              bn: "আপনি যে পাতাটি খুঁজছেন তা সম্ভবত সরানো হয়েছে, নাম পরিবর্তন করা হয়েছে অথবা সাময়িকভাবে অনুপলব্ধ।",
              en: "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
            })}
          </p>
        </Reveal>

        <Reveal delay={200}>
          <Button href="/" variant="secondary" className="px-6 h-11">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t({
              bn: "হোমে ফিরে যান",
              en: "Back to Homepage",
            })}
          </Button>
        </Reveal>
      </div>
    </div>
  );
}
