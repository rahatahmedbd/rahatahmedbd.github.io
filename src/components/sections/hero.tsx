"use client";

import { ArrowRight, Droplet, GraduationCap, Heart } from "lucide-react";
import { hero } from "@/content/home";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Badge, Chip } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="absolute inset-0 bg-grid-faint [background-size:64px_64px] opacity-[0.35] mask-fade-b [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-600/20 blur-[120px]" />
        <div className="absolute -right-20 top-40 h-72 w-72 rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pb-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:px-8 lg:pb-28">
        {/* Copy */}
        <div className="flex flex-col items-start gap-6">
          <Reveal direction="fade">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/15 bg-surface/60 px-4 py-1.5 text-xs font-medium text-fg-soft backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {t(hero.eyebrow)}
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="text-display-xl font-bold tracking-tight">
              <span className="text-gradient">{t(hero.name)}</span>
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-fg-soft sm:text-lg">
              {t(hero.subtitle)}
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="flex flex-wrap gap-2">
              {hero.chips.map((chip) => (
                <Chip
                  key={chip.en}
                  tone={chip.tone === "blood" ? "brand" : "default"}
                >
                  {chip.tone === "blood" && (
                    <Droplet className="h-3.5 w-3.5" />
                  )}
                  {t(chip)}
                </Chip>
              ))}
            </div>
          </Reveal>

          <Reveal delay={260}>
            <div className="flex flex-wrap items-center gap-3">
              <Button href="#achievements" size="lg">
                {t(hero.primaryCta)}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button href="#contact" variant="secondary" size="lg">
                {t(hero.secondaryCta)}
              </Button>
              <Button href="/rahatverse" variant="gold" size="lg">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                {t({ bn: "রাহাতভার্সে প্রবেশ", en: "Enter RahatVerse" })}
              </Button>
            </div>
          </Reveal>

          <Reveal delay={320}>
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
        <Reveal direction="scale" delay={160} className="relative mx-auto">
          <div className="relative aspect-square w-[min(78vw,22rem)]">
            {/* rotating rings */}
            <div className="absolute inset-0 rounded-full border border-border/10" />
            <div className="absolute inset-3 rounded-full border border-border/10 [mask-image:linear-gradient(to_top,transparent,black)]" />
            {/* glow */}
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

            {/* floating badge */}
            <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-border/15 bg-surface/90 px-4 py-2 shadow-lift backdrop-blur">
              <GraduationCap className="h-4 w-4 text-brand-500" />
              <span className="text-sm font-semibold">
                {t({ bn: "HSC ২য় বর্ষ · বিজ্ঞান", en: "HSC 2nd Year · Science" })}
              </span>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Scroll hint */}
      <Reveal direction="fade" delay={400}>
        <a
          href="#about"
          className="mx-auto flex w-fit flex-col items-center gap-2 pb-10 text-xs uppercase tracking-[0.2em] text-fg-muted transition-colors hover:text-fg"
        >
          {t(hero.scrollHint)}
          <span className="flex h-9 w-5 items-start justify-center rounded-full border border-border/20 p-1">
            <span className="h-2 w-1 animate-bounce rounded-full bg-fg-muted" />
          </span>
        </a>
      </Reveal>
    </section>
  );
}
