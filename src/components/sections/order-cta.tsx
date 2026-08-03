"use client";

import { ArrowRight, CheckCircle2, MessageCircle, ShieldCheck, Sparkles, Clock, Zap } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Container, Section, Badge } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const points = [
  { en: "Fixed price agreed before any work starts", bn: "কাজ শুরুর আগেই নির্দিষ্ট মূল্য", icon: ShieldCheck },
  { en: "First draft within 7 days", bn: "৭ দিনের মধ্যে প্রথম ড্রাফট", icon: Clock },
  { en: "Mobile-first, fast and SEO ready", bn: "মোবাইল-ফার্স্ট, দ্রুত ও এসইও-রেডি", icon: Zap },
];

const trustSignals = [
  { en: "No upfront payment required", bn: "এডভান্স পেমেন্ট নেই", icon: Sparkles },
  { en: "Unlimited revisions until satisfied", bn: "সন্তুষ্ট না হলে অনলিমিটেড রিভিশন", icon: ShieldCheck },
  { en: "Post-launch support included", bn: "লঞ্চের পরেও সাপোর্ট", icon: MessageCircle },
];

/**
 * The single primary conversion block on the homepage — premium, persuasive, impossible to miss.
 * Enhanced with trust signals, better visual hierarchy, and stronger CTAs.
 */
export function OrderCta() {
  const { t } = useLanguage();

  return (
    <Section className="py-16 sm:py-24 relative" id="order-cta">
      <Container>
        <Reveal direction="scale">
          <div className={cn(
            "relative overflow-hidden rounded-4xl",
            "bg-gradient-to-br from-brand-900/95 via-brand-800 to-brand-900/95",
            "border border-brand-500/20",
            "shadow-[0_25px_80px_-25px_rgba(244,63,94,0.5)]",
            "text-white",
            "before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top_right,rgba(244,63,94,0.25)_0%,transparent_60%)]",
            "after:absolute after:inset-0 after:bg-[radial-gradient(ellipse_at_bottom_left,rgba(56,189,248,0.15)_0%,transparent_50%)]"
          )}">
            
            {/* Decorative orbs */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-12 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
            
            {/* Subtle pattern overlay */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:60px_60px]" />

            <div className="relative mx-auto max-w-3xl px-6 py-14 sm:px-10 sm:py-18 lg:py-22">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur mb-6">
                <Sparkles className="h-3.5 w-3.5 text-brand-300" />
                {t({ en: "Start your project in 2 minutes", bn: "২ মিনিটে প্রজেক্ট শুরু করুন" })}
              </div>

              {/* Main Headline */}
              <h2 className="text-balance text-3xl font-extrabold tracking-[-0.025em] leading-[1.08] sm:text-4xl lg:text-5xl">
                {t({
                  en: "Ready for a website that actually works?",
                  bn: "আপনার ব্যবসার জন্য একটি কার্যকর ওয়েবসাইট চান?",
                })}
              </h2>

              {/* Subtitle */}
              <p className="mt-5 text-pretty text-base leading-relaxed text-white/80 sm:text-lg max-w-2xl mx-auto">
                {t({
                  en: "Answer a few short questions and get an instant price estimate and timeline. No calls required, no obligation.",
                  bn: "কয়েকটি সহজ প্রশ্নের উত্তর দিন — সঙ্গে সঙ্গেই মূল্য ও সময়ের ধারণা পাবেন। কোনো বাধ্যবাধকতা নেই।",
                })}
              </p>

              {/* Key Benefits */}
              <ul className="mx-auto mt-8 flex max-w-lg flex-col items-start gap-3 sm:items-center">
                {points.map((p, i) => {
                  const Icon = p.icon;
                  return (
                    <li key={p.en} className="flex items-start gap-3 text-sm text-white/90 group transition-colors duration-300">
                      <span className={cn(
                        "shrink-0 grid h-5 w-5 place-items-center rounded-xl",
                        "bg-white/10 text-white/70 group:bg-brand-500 group:text-white transition-all duration-300"
                      )}>
                        <Icon className="h-3 w-3" />
                      </span>
                      <span className="leading-relaxed">{t(p)}</span>
                    </li>
                  );
                })}
              </ul>

              {/* Trust Signals */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
                {trustSignals.map((ts, i) => {
                  const Icon = ts.icon;
                  return (
                    <Badge key={ts.en} tone="light" className="text-[11px] px-3 py-1.5 bg-white/8 hover:bg-white/15 transition-colors border-white/15 ring-white/10">
                      <Icon className="h-3 w-3 text-white/70" />
                      {t(ts)}
                    </Badge>
                  );
                })}
              </div>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
                <Button
                  href="/order"
                  variant="light"
                  size="xl"
                  className={cn(
                    "relative overflow-hidden",
                    "bg-gradient-to-r from-white via-white/90 to-white",
                    "text-slate-900 font-bold",
                    "shadow-[0_12px_40px_-12px_rgba(255,255,255,0.4)]",
                    "hover:shadow-[0_16px_48px_-12px_rgba(255,255,255,0.55)]",
                    "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:-translate-x-full before:animate-[shimmer_2s_ease-out_infinite]"
                  )}
                >
                  <span className="relative flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    {t({ en: "Start My Project", bn: "প্রজেক্ট শুরু করুন" })}
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Button>
                <Button
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="ghost"
                  size="xl"
                  className={cn(
                    "border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50",
                    "font-semibold"
                  )}
                >
                  <MessageCircle className="h-5 w-5" />
                  {t({ en: "Ask a question first", bn: "প্রশ্ন করুন" })}
                </Button>
              </div>

              {/* Meta info */}
              <p className="mt-6 text-xs text-white/60 text-center">
                {t({
                  en: "Takes about 2 minutes · Free estimate · No credit card required",
                  bn: "সময় লাগবে প্রায় ২ মিনিট · বিনামূল্যে এস্টিমেট · ক্রেডিট কার্ড দরকার নেই",
                })}
              </p>

              {/* Social proof line */}
              <div className="mt-8 flex items-center justify-center gap-4 text-[11px] text-white/50">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  {t({ en: "12+ projects delivered", bn: "১২+ প্রজেক্ট ডেলিভারড" })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                  {t({ en: "5.0 client rating", bn: "৫.০ ক্লায়েন্ট রেটিং" })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                  {t({ en: "Avg 7-day first draft", bn: "গড় ৭ দিনে ফাস্ট ড্রাফট" })}
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}