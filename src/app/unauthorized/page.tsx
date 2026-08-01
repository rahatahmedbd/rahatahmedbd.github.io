"use client";

import { Lock, ArrowLeft, LogIn } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export default function UnauthorizedPage() {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-[80vh] overflow-hidden flex items-center justify-center py-20">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="absolute inset-0 bg-grid-faint [background-size:64px_64px] opacity-[0.35] mask-fade-b [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-600/10 blur-[120px]" />
        <div className="absolute -right-20 top-40 h-72 w-72 rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <div className="mx-auto w-full max-w-md px-5 text-center flex flex-col items-center">
        <Reveal direction="scale">
          <div className="relative mb-6 grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft">
            <Lock className="h-10 w-10 animate-pulse" />
            <div className="absolute -inset-2 -z-10 rounded-2xl bg-brand-600/15 blur-lg" />
          </div>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="text-display-md font-bold tracking-tight mb-3">
            <span className="text-gradient">
              {t({
                bn: "অননুমোদিত প্রবেশ",
                en: "Unauthorized Access",
              })}
            </span>
          </h1>
          <p className="text-sm font-mono text-brand-500 uppercase tracking-widest mb-4">
            {t({
              bn: "ত্রুটি ৪০৪ / প্রবেশাধিকার সংরক্ষিত",
              en: "Error 404 / Access Denied",
            })}
          </p>
        </Reveal>

        <Reveal delay={140}>
          <p className="text-pretty text-base leading-relaxed text-fg-soft mb-8">
            {t({
              bn: "এই পাতাটি দেখার জন্য আপনার প্রয়োজনীয় অনুমতি নেই অথবা আপনি লগইন করেননি। অনুগ্রহ করে সঠিক অ্যাকাউন্ট দিয়ে লগইন করুন।",
              en: "You do not have the required permissions to access this page, or you are not logged in. Please log in with an authorized account.",
            })}
          </p>
        </Reveal>

        <Reveal delay={200}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
            <Button href="/" variant="secondary" className="w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t({
                bn: "হোমে ফিরে যান",
                en: "Go Back Home",
              })}
            </Button>
            <Button href="/login" className="w-full sm:w-auto">
              <LogIn className="h-4 w-4 mr-2" />
              {t({
                bn: "লগইন করুন",
                en: "Log In",
              })}
            </Button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
