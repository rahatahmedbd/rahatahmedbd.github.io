"use client";

import { education } from "@/content/education";
import { useLanguage } from "@/components/providers/language-provider";
import {
  Container,
  Reveal,
  Section,
  SectionHeading,
} from "@/components/ui/primitives";
import { Badge, Chip } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export function Education() {
  const { t } = useLanguage();

  return (
    <Section id="education" className="bg-canvas-subtle/60">
      <Container size="narrow">
        <SectionHeading
          eyebrow={t(education.eyebrow)}
          title={t(education.title)}
          subtitle={t(education.subtitle)}
        />

        <div className="relative mt-16 pl-8 sm:pl-12">
          {/* vertical line */}
          <div className="absolute left-[10px] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-brand-500/60 via-border/40 to-transparent sm:left-[14px]" />

          <div className="flex flex-col gap-8">
            {education.milestones.map((m, i) => (
              <Reveal key={i} direction="up" delay={i * 70} className="relative">
                {/* marker */}
                <span
                  className={cn(
                    "absolute -left-8 top-1 grid h-6 w-6 place-items-center rounded-full border text-xs sm:-left-12",
                    m.active
                      ? "border-brand-500/40 bg-brand-500/15 shadow-glow"
                      : "border-border/20 bg-canvas"
                  )}
                >
                  {m.icon}
                </span>

                <article
                  className={cn(
                    "card-surface rounded-3xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift sm:p-7",
                    m.active && "ring-1 ring-brand-500/30"
                  )}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
                      {t(m.period)}
                    </span>
                    {m.badge && <Badge tone="success">{m.badge}</Badge>}
                    {m.active && <Badge tone="brand">{t({ bn: "বর্তমান", en: "Current" })}</Badge>}
                  </div>

                  <h3 className="mt-3 text-lg font-bold tracking-tight sm:text-xl">
                    {t(m.title)}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-fg-muted">
                    {t(m.institution)}
                  </p>
                  <p className="mt-3 text-pretty leading-relaxed text-fg-soft">
                    {t(m.desc)}
                  </p>

                  {m.tags && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {m.tags.map((tag) => (
                        <Chip key={tag.en} tone="outline">
                          {t(tag)}
                        </Chip>
                      ))}
                    </div>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
