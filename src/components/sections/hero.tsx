"use client";

import {
  ArrowRight,
  Award,
  Droplet,
  GraduationCap,
  Heart,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
  MousePointer2,
  Zap,
} from "lucide-react";
import { hero } from "@/content/home";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Badge, Chip } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The homepage opening — premium, cinematic, and conversion-focused.
 * One unmistakable primary action (order a website), one low-friction alternative (ask a question),
 * and the credibility signals a visitor needs before either.
 */
export function Hero() {
  const { t } = useLanguage();

  const proof = [
    {
      icon: Award,
      value: "12+",
      label: { bn: "অর্জন ও পুরস্কার", en: "Awards & achievements" },
    },
    {
      icon: Droplet,
      value: "4×",
      label: { bn: "রক্তদান (A+)", en: "Blood donations (A+)" },
    },
    {
      icon: Star,
      value: "5.00",
      label: { bn: "SSC GPA (A+)", en: "SSC GPA (A+)" },
    },
  ];

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-28 sm:pt-36 lg:pt-40 pb-20 sm:pb-28"
    >
      {/* Enhanced Ambient Background - Premium Atmospheric Depth */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Radial brand glow */}
        <div className="absolute inset-0 bg-radial-fade" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-grid-faint [background-size:72px_72px] opacity-[0.25] [mask-image:linear-gradient(to_bottom,black,transparent_65%)]" />
        {/* Layered atmospheric blobs */}
        <div className="absolute -left-32 top-8 h-96 w-96 rounded-full bg-brand-600/15 blur-[160px]" />
        <div className="absolute -right-28 top-56 h-96 w-96 rounded-full bg-cyan-500/10 blur-[160px]" />
        <div className="absolute left-1/2 -top-20 -translate-x-1/2 h-72 w-72 rounded-full bg-indigo-500/8 blur-[140px]" />
        {/* Subtle vignette */}
        <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.15)_100%)] dark:[background:radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-5 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:px-8 lg:pb-24">
        {/* Copy — Premium Typography & Spacing */}
        <div className="flex flex-col items-start gap-8">
          {/* Eyebrow with live indicator */}
          <Reveal direction="fade" className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/15 bg-surface/70 px-4 py-1.5 text-xs font-medium text-fg-soft backdrop-blur-xl shadow-soft ring-1 ring-inset ring-white/10 dark:ring-black/10">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              {t(hero.eyebrow)}
              <span className="hidden sm:inline-flex items-center gap-1 ml-2 text-[10px] font-mono text-brand-500/80">
                <Zap className="h-2.5 w-2.5" />
                V2
              </span>
            </span>
          </Reveal>

          {/* Greeting + Name — Enhanced Typography */}
          <Reveal delay={80} className="relative">
            <div className="flex flex-col gap-3">
              <span className="text-sm font-semibold uppercase tracking-[0.25em] text-fg-muted">
                {t({ bn: "আসসালামু আলাইকুম, আমি", en: "Assalamu Alaikum, I am" })}
              </span>
              <h1 className="text-display-2xl font-extrabold tracking-[-0.03em] leading-[1.02]">
                <span className="text-gradient-brand">{t(hero.name)}</span>
              </h1>
            </div>
            {/* Decorative accent line */}
            <div className="absolute -bottom-2 left-0 w-20 h-px bg-gradient-to-r from-brand-500 to-transparent" />
          </Reveal>

          {/* Subtitle — Better Readability */}
          <Reveal delay={150}>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-fg-soft sm:text-lg lg:text-base">
              {t(hero.subtitle)}
            </p>
          </Reveal>

          {/* Identity Chips — Enhanced */}
          <Reveal delay={210}>
            <div className="flex flex-wrap items-center gap-2.5">
              {hero.chips.map((chip) => (
                <Chip
                  key={chip.en}
                  tone={chip.tone === "blood" ? "brand" : "outline"}
                  className="shadow-sm"
                >
                  {chip.tone === "blood" && <Droplet className="h-3.5 w-3.5" />}
                  {t(chip)}
                </Chip>
              ))}
            </div>
          </Reveal>

          {/* Primary Conversion — Impossible to Miss, Premium Styling */}
          <Reveal delay={280} className="relative">
            <div className="flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:items-center">
              <Button
                href="/order"
                size="lg"
                className={cn(
                  "w-full sm:w-auto relative overflow-hidden",
                  "bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600",
                  "bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite]",
                  "shadow-[0_12px_40px_-12px_rgba(244,63,94,0.6)]",
                  "hover:shadow-[0_16px_48px_-12px_rgba(244,63,94,0.75)]",
                  "text-white font-bold"
                )}
              >
                <span className="relative flex items-center gap-2">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                  {t({ bn: "ওয়েবসাইট অর্ডার করুন", en: "Order a Website" })}
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                {/* Subtle shine sweep */}
                <span className="absolute inset-0 -translate-x-full animate-[shimmer_3s_linear_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </Button>
              <Button
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto border-2 border-border/20 bg-surface/80 backdrop-blur-xl hover:border-brand-500/50 hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-400"
              >
                <MessageCircle className="h-5 w-5" />
                {t({ bn: "প্রশ্ন করুন", en: "Ask a question" })}
              </Button>
            </div>

            {/* Trust signals below buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-fg-muted">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                {t({ bn: "কাজ শুরুর আগেই নির্দিষ্ট মূল্য", en: "Fixed price before work starts" })}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                {t({ bn: "২ মিনিটে বিনামূল্যে এস্টিমেট", en: "Free estimate in 2 minutes" })}
              </span>
              <span className="inline-flex items-center gap-1.5 hidden sm:inline-flex">
                <MousePointer2 className="h-3.5 w-3.5 text-violet-400" />
                {t({ bn: "কোডিং দক্ষতা দরকার নেই", en: "No coding skills needed" })}
              </span>
            </div>
          </Reveal>

          {/* Badges — Premium */}
          <Reveal delay={340}>
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="gold" className="shadow-sm ring-1 ring-inset ring-gold-500/20">
                <Heart className="h-3.5 w-3.5" />
                {t(hero.badges.blood)}
              </Badge>
              <Badge tone="success" className="shadow-sm ring-1 ring-inset ring-emerald-500/20">
                <Droplet className="h-3.5 w-3.5" />
                {t(hero.badges.donor)}
              </Badge>
              <Badge tone="brand" className="shadow-sm ring-1 ring-inset ring-brand-500/20">
                <GraduationCap className="h-3.5 w-3.5" />
                {t({ bn: "HSC ২য় বর্ষ", en: "HSC 2nd Year" })}
              </Badge>
            </div>
          </Reveal>
        </div>

        {/* Portrait — Cinematic Frame */}
        <Reveal direction="scale" delay={200} className="relative mx-auto">
          <div className="relative aspect-square w-[min(85vw,24rem)] max-w-[28rem]">
            {/* Outer glow rings */}
            <div className="absolute inset-0 rounded-full border border-border/10" />
            <div className="absolute inset-4 rounded-full border border-border/10 [mask-image:linear-gradient(to_top,transparent,black_60%)]" />
            <div className="absolute -inset-8 -z-10 rounded-full bg-gradient-to-br from-brand-600/20 via-transparent to-cyan-500/15 blur-3xl" />
            <div className="absolute -inset-16 -z-10 rounded-full bg-brand-600/8 blur-[120px] opacity-50" />

            {/* Portrait container with premium frame */}
            <div className="absolute inset-6 overflow-hidden rounded-full border border-border/15 bg-surface shadow-[0_20px_60px_-20px_rgba(0,0,0,0.4)] relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/profile.jpg"
                alt="Portrait of Rahat Ahmed"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                loading="eager"
                decoding="async"
              />
              {/* Inner vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating HSC badge — Enhanced */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2.5 whitespace-nowrap rounded-3xl border border-border/15 bg-surface/95 px-5 py-2.5 shadow-lift backdrop-blur-xl ring-1 ring-inset ring-white/10 dark:ring-black/10 animate-float">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500/12">
                <GraduationCap className="h-5 w-5 text-brand-500" />
              </span>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-fg">
                  {t({ bn: "HSC ২য় বর্ষ · বিজ্ঞান", en: "HSC 2nd Year · Science" })}
                </div>
                <div className="text-xs text-fg-muted">
                  {t({ bn: "সুনামগঞ্জ সরকারি কলেজ", en: "Sunamganj Govt. College" })}
                </div>
              </div>
            </div>

            {/* Scroll hint */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-full mb-4 opacity-60 animate-[float_2s_ease-in-out_infinite]">
              <MousePointer2 className="h-6 w-6 text-fg-muted" />
            </div>
          </div>
        </Reveal>
      </div>

      {/* Proof Strip — Premium Card Design */}
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <Reveal delay={180} direction="up">
          <div className="grid grid-cols-3 divide-x divide-border/10 overflow-hidden rounded-3xl border border-border/10 bg-surface/60 backdrop-blur-xl shadow-soft">
            {proof.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.value}
                  className={cn(
                    "relative flex flex-col items-center gap-1.5 px-4 py-6 text-center sm:flex-row sm:justify-center sm:gap-4 sm:py-7 transition-all duration-500 hover:bg-surface/80 hover:shadow-inner",
                    i > 0 && "before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-border/10"
                  )}
                >
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-brand-500/10 rounded-full blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Icon className="relative h-5 w-5 shrink-0 text-brand-500 sm:h-6 sm:w-6" />
                  </div>
                  <span className="flex flex-col sm:items-start">
                    <span className="text-xl font-extrabold leading-none tracking-tight sm:text-2xl text-fg">
                      {p.value}
                    </span>
                    <span className="mt-1.5 text-[10px] leading-tight text-fg-muted sm:text-xs">
                      {t(p.label)}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
