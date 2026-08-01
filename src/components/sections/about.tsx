"use client";

import { Quote } from "lucide-react";
import { about } from "@/content/about";
import { useLanguage } from "@/components/providers/language-provider";
import {
  Container,
  Reveal,
  Section,
  SectionHeading,
} from "@/components/ui/primitives";

export function About() {
  const { t } = useLanguage();

  return (
    <Section id="about">
      <Container>
        <SectionHeading
          eyebrow={t(about.eyebrow)}
          title={t(about.title)}
          subtitle={t(about.subtitle)}
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          {/* Left: image + quote */}
          <div className="flex flex-col gap-6">
            <Reveal direction="left" className="relative">
              <div className="relative aspect-[3/4] overflow-hidden rounded-4xl border border-border/10 shadow-lift">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/profile.jpg"
                  alt="Rahat Ahmed at Sunamganj"
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* Floating HSC badge */}
              <div className="absolute -bottom-5 -right-3 flex items-center gap-3 rounded-2xl border border-border/15 bg-surface/95 px-4 py-3 shadow-lift backdrop-blur sm:-right-5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/12 text-xl">
                  🎓
                </span>
                <div className="leading-tight">
                  <div className="text-sm font-semibold">{t(about.badge.title)}</div>
                  <div className="text-xs text-fg-muted">{t(about.badge.sub)}</div>
                </div>
              </div>
            </Reveal>

            <Reveal direction="up" delay={120}>
              <figure className="relative overflow-hidden rounded-4xl border border-gold-500/20 bg-gradient-to-br from-gold-500/10 to-transparent p-6 sm:p-8">
                <Quote className="absolute -right-2 -top-2 h-16 w-16 text-gold-500/15" />
                <blockquote className="relative">
                  <p className="text-pretty text-lg font-medium leading-relaxed text-fg">
                    “{t(about.quote)}”
                  </p>
                </blockquote>
              </figure>
            </Reveal>
          </div>

          {/* Right: story + facts */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              {about.story.map((para, i) => (
                <Reveal key={i} direction="right" delay={i * 80}>
                  <p className="text-pretty leading-relaxed text-fg-soft">
                    {t(para)}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal direction="up" delay={120}>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {about.facts.map((fact) => (
                  <div
                    key={fact.icon + fact.label.en}
                    className="group flex items-center gap-3 rounded-2xl border border-border/10 bg-surface/60 p-4 transition-colors hover:border-brand-500/25"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-canvas-muted text-lg transition-transform duration-300 group-hover:scale-110">
                      {fact.icon}
                    </span>
                    <div className="min-w-0 leading-tight">
                      <div className="text-[11px] uppercase tracking-wide text-fg-muted">
                        {t(fact.label)}
                      </div>
                      <div className="truncate text-sm font-semibold text-fg">
                        {t(fact.value)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal direction="up" delay={160}>
              <a
                href="#education"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-500 dark:text-brand-400"
              >
                <span className="link-underline">{t(about.cta)}</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
