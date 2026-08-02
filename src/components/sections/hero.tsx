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
} from "lucide-react";
import { hero } from "@/content/home";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Badge, Chip } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/lib/site";

/**
 * The homepage opening. One unmistakable primary action (order a website),
 * one low-friction alternative (ask a question), and the credibility signals
 * a visitor needs before either.
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
      className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="absolute inset-0 bg-grid-faint [background-size:64px_64px] opacity-[0.3] [mask-image:linear-gradient(to_bottom,black,transparent_72%)]" />
        <div className="absolute -left-28 top-4 h-80 w-80 rounded-full bg-brand-600/20 blur-[130px]" />
        <div className="absolute -right-24 top-44 h-80 w-80 rounded-full bg-indigo-500/12 blur-[130px]" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pb-14 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:px-8 lg:pb-20">
        {/* Copy */}
        <div className="flex flex-col items-start gap-6">
          <Reveal direction="fade">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/15 bg-surface/60 px-4 py-1.5 text-xs font-medium text-fg-soft backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              {t(hero.eyebrow)}
            </span>
          </Reveal>

          <Reveal delay={70}>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold uppercase tracking-[0.22em] text-fg-muted">
                {t({ bn: "আসসালামু আলাইকুম, আমি", en: "Assalamu Alaikum, I am" })}
              </span>
              <h1 className="text-display-xl font-bold tracking-tight">
                <span className="text-gradient">{t(hero.name)}</span>
              </h1>
            </div>
          </Reveal>

          <Reveal delay={130}>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-fg-soft sm:text-lg">
              {t(hero.subtitle)}
            </p>
          </Reveal>

          <Reveal delay={190}>
            <div className="flex flex-wrap gap-2">
              {hero.chips.map((chip) => (
                <Chip key={chip.en} tone={chip.tone === "blood" ? "brand" : "default"}>
                  {chip.tone === "blood" && <Droplet className="h-3.5 w-3.5" />}
                  {t(chip)}
                </Chip>
              ))}
            </div>
          </Reveal>

          {/* Primary conversion — impossible to miss */}
          <Reveal delay={250}>
            <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Button href="/order" size="lg" className="w-full sm:w-auto">
                <Sparkles className="h-4 w-4" />
                {t({ bn: "ওয়েবসাইট অর্ডার করুন", en: "Order a Website" })}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                <MessageCircle className="h-4 w-4" />
                {t({ bn: "প্রশ্ন করুন", en: "Ask a question" })}
              </Button>
            </div>
          </Reveal>

          <Reveal delay={300}>
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-fg-muted">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                {t({ bn: "কাজ শুরুর আগেই নির্দিষ্ট মূল্য", en: "Fixed price before work starts" })}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                {t({ bn: "২ মিনিটে বিনামূল্যে এস্টিমেট", en: "Free estimate in 2 minutes" })}
              </span>
            </p>
          </Reveal>

          <Reveal delay={340}>
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge tone="gold">
                <Heart className="h-3.5 w-3.5" />
                {t(hero.badges.blood)}
              </Badge>
              <Badge tone="success">
                <Droplet className="h-3.5 w-3.5" />
                {t(hero.badges.donor)}
              </Badge>
            </div>
          </Reveal>
        </div>

        {/* Portrait */}
        <Reveal direction="scale" delay={150} className="relative mx-auto">
          <div className="relative aspect-square w-[min(78vw,22rem)]">
            <div className="absolute inset-0 rounded-full border border-border/10" />
            <div className="absolute inset-3 rounded-full border border-border/10 [mask-image:linear-gradient(to_top,transparent,black)]" />
            <div className="absolute -inset-6 -z-10 rounded-full bg-brand-600/15 blur-3xl" />

            <div className="absolute inset-5 overflow-hidden rounded-full border border-border/15 bg-surface shadow-lift">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/profile.jpg"
                alt="Portrait of Rahat Ahmed"
                className="h-full w-full object-cover"
                loading="eager"
                decoding="async"
              />
            </div>

            <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-2xl border border-border/15 bg-surface/90 px-4 py-2 shadow-lift backdrop-blur">
              <GraduationCap className="h-4 w-4 text-brand-500" />
              <span className="text-sm font-semibold">
                {t({ bn: "HSC ২য় বর্ষ · বিজ্ঞান", en: "HSC 2nd Year · Science" })}
              </span>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Proof strip */}
      <div className="mx-auto w-full max-w-6xl px-5 pb-14 sm:px-6 lg:px-8 lg:pb-20">
        <Reveal delay={120}>
          <div className="grid grid-cols-3 divide-x divide-border/10 overflow-hidden rounded-3xl border border-border/10 bg-surface/50 backdrop-blur">
            {proof.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.value}
                  className="flex flex-col items-center gap-1 px-3 py-5 text-center sm:flex-row sm:justify-center sm:gap-3 sm:py-6"
                >
                  <Icon className="h-4 w-4 shrink-0 text-brand-500 sm:h-5 sm:w-5" />
                  <span className="flex flex-col sm:items-start">
                    <span className="text-lg font-bold leading-none tracking-tight sm:text-xl">
                      {p.value}
                    </span>
                    <span className="mt-1 text-[10px] leading-tight text-fg-muted sm:text-xs">
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
