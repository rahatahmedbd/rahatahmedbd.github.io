"use client";

import { ArrowUpRight } from "lucide-react";
import { experience } from "@/content/experience";
import { useLanguage } from "@/components/providers/language-provider";
import {
  Container,
  Reveal,
  Section,
  SectionHeading,
  Badge,
} from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Experience() {
  const { t } = useLanguage();

  return (
    <Section id="experience" className="bg-canvas-subtle/60">
      <Container>
        <SectionHeading
          eyebrow={t(experience.eyebrow)}
          title={t(experience.title)}
          subtitle={t(experience.subtitle)}
        />

        {/* Initiatives */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {experience.initiatives.map((item, i) => (
            <Reveal key={i} direction={i % 2 === 0 ? "left" : "right"}>
              <article className="card-surface flex h-full flex-col rounded-4xl p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-canvas-muted text-2xl">
                    {item.icon}
                  </span>
                  <div className="flex flex-col items-end gap-2 text-right">
                    <Badge tone="default">{t(item.status)}</Badge>
                    <span className="text-xs text-fg-muted">{t(item.date)}</span>
                  </div>
                </div>

                <h3 className="mt-5 text-xl font-bold tracking-tight">
                  {t(item.title)}
                </h3>
                <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
                  {t(item.role)}
                </p>
                <p className="mt-3 text-pretty leading-relaxed text-fg-soft">
                  {t(item.desc)}
                </p>

                <dl className="mt-5 flex flex-col gap-2 border-t border-border/10 pt-5">
                  {item.details.map((d) => (
                    <div key={d.label.en} className="flex gap-2 text-sm">
                      <dt className="shrink-0 font-medium text-fg-muted">
                        {t(d.label)}
                      </dt>
                      <dd className="text-fg-soft">{t(d.value)}</dd>
                    </div>
                  ))}
                </dl>

                {item.note && (
                  <p className="mt-4 rounded-2xl bg-canvas-muted/70 px-4 py-3 text-sm italic text-fg-soft">
                    {t(item.note)}
                  </p>
                )}

                {item.link && (
                  <a
                    href={item.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-5 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-400"
                  >
                    <span className="link-underline">{t(item.link.label)}</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                )}
              </article>
            </Reveal>
          ))}
        </div>

        {/* Roles divider */}
        <Reveal direction="fade" className="mt-16 flex items-center gap-4">
          <span className="h-px flex-1 bg-border/10" />
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-fg-muted">
            {t(experience.rolesDivider)}
          </span>
          <span className="h-px flex-1 bg-border/10" />
        </Reveal>

        {/* Roles grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {experience.roles.map((role, i) => (
            <Reveal key={i} direction="up" delay={(i % 4) * 70}>
              <article
                className={cn(
                  "card-surface flex h-full flex-col rounded-3xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift",
                  role.tone === "blood" && "ring-1 ring-brand-500/20"
                )}
              >
                <span
                  className={cn(
                    "grid h-12 w-12 place-items-center rounded-xl text-xl",
                    role.tone === "blood"
                      ? "bg-brand-500/12"
                      : "bg-canvas-muted"
                  )}
                >
                  {role.icon}
                </span>
                <h3 className="mt-4 text-base font-bold tracking-tight">
                  {t(role.title)}
                </h3>
                <p className="text-xs font-medium text-fg-muted">{t(role.since)}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-soft">
                  {t(role.desc)}
                </p>
                <div className="mt-4">
                  <Badge tone={role.tone === "blood" ? "brand" : "success"}>
                    {t(role.status)}
                  </Badge>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Web dev services */}
        <Reveal direction="up" className="mt-8">
          <article className="relative overflow-hidden rounded-4xl border border-brand-500/20 bg-gradient-to-br from-brand-700 via-brand-800 to-[#3a0a18] p-8 text-white shadow-lift sm:p-10">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15 text-2xl backdrop-blur">
                  {experience.services.icon}
                </span>
                <div>
                  <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
                    {t(experience.services.title)}
                  </h3>
                  <p className="text-sm text-white/80">
                    {t(experience.services.subtitle)}
                  </p>
                </div>
              </div>

              <p className="mt-5 max-w-2xl text-pretty leading-relaxed text-white/90">
                {t(experience.services.desc)}
              </p>

              <div className="mt-6">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-white/70">
                  {t(experience.services.typesLabel)}
                </h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {experience.services.types.map((type) => (
                    <span
                      key={type.en}
                      className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur transition-colors hover:bg-white/20"
                    >
                      {t(type)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {experience.services.features.map((f) => (
                  <div
                    key={f.label.en}
                    className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium backdrop-blur"
                  >
                    <span className="text-base">{f.icon}</span>
                    {t(f.label)}
                  </div>
                ))}
              </div>

              <div className="mt-7">
                <Button href="#contact" variant="light" size="lg">
                  {t(experience.services.cta)}
                </Button>
              </div>
            </div>
          </article>
        </Reveal>
      </Container>
    </Section>
  );
}
