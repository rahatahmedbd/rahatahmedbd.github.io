"use client";

import { Facebook, MessageCircle } from "lucide-react";
import { blood } from "@/content/blood";
import { useLanguage } from "@/components/providers/language-provider";
import { useCountUp } from "@/hooks/use-count-up";
import { Container, Reveal, Section, Eyebrow } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { shantichakraGroup } from "@/lib/site";

function BloodStat({
  count,
  literal,
  label,
}: {
  count?: number;
  literal?: string;
  label: { bn: string; en: string };
}) {
  const { t, lang } = useLanguage();
  const { ref, display } = useCountUp(count ?? 0, lang, 1600);
  return (
    <div className="rounded-3xl border border-white/15 bg-white/[0.06] p-6 text-center backdrop-blur">
      <div className="text-display-lg font-extrabold text-white">
        {literal ? (
          literal
        ) : (
          <span ref={ref}>{display}</span>
        )}
      </div>
      <div className="mt-1 text-sm font-medium text-white/75">{t(label)}</div>
    </div>
  );
}

export function Blood() {
  const { t } = useLanguage();

  return (
    <Section id="blood" className="overflow-hidden">
      {/* Crimson gradient backdrop */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#5a0a20] via-[#7a0c2e] to-[#3a0712]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,255,255,0.10),transparent_70%)]" />

      {/* Heartbeat line */}
      <svg
        className="absolute inset-x-0 top-0 -z-10 h-12 w-full text-white/20"
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,30 L200,30 L220,10 L240,50 L260,20 L280,40 L300,30 L1200,30"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      <Container className="relative text-white">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <Reveal direction="fade">
            <Eyebrow tone="light">{t(blood.eyebrow)}</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="max-w-3xl text-balance text-display-lg font-bold tracking-tight">
              {t(blood.title)}
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto max-w-2xl text-pretty leading-relaxed text-white/85">
              {t(blood.subtitle)}
            </p>
          </Reveal>
        </div>

        {/* Logo with pulse */}
        <Reveal direction="scale" className="mt-12 flex justify-center">
          <div className="relative grid h-32 w-32 place-items-center sm:h-40 sm:w-40">
            <span className="absolute inset-0 animate-ping rounded-full bg-white/10 [animation-duration:3s]" />
            <span className="absolute inset-2 rounded-full border border-white/20" />
            <span className="absolute inset-5 rounded-full border border-white/15" />
            <div className="relative grid h-24 w-24 place-items-center overflow-hidden rounded-full border border-white/25 bg-white/10 backdrop-blur sm:h-28 sm:w-28">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={blood.logoSrc}
                alt={blood.logoAlt}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </Reveal>

        {/* Role card */}
        <Reveal direction="up" className="mt-12">
          <div className="mx-auto max-w-3xl rounded-4xl border border-white/15 bg-white/[0.06] p-7 backdrop-blur sm:p-9">
            <div className="flex flex-wrap items-center justify-center gap-3 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 px-3 py-1 text-xs font-semibold text-white">
                {t(blood.roleBadge)}
              </span>
              <h3 className="text-lg font-bold sm:text-xl">{t(blood.roleTitle)}</h3>
            </div>
            <p className="mt-4 text-center text-pretty leading-relaxed text-white/85">
              {t(blood.roleDesc)}
            </p>
          </div>
        </Reveal>

        {/* Stats */}
        <Reveal direction="up" className="mt-8">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {blood.stats.map((s, i) => (
              <BloodStat key={i} {...s} />
            ))}
          </div>
        </Reveal>

        {/* Services */}
        <Reveal direction="up" className="mt-14">
          <h3 className="text-center text-xl font-bold tracking-tight">
            {t(blood.servicesTitle)}
          </h3>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {blood.services.map((s, i) => (
              <Reveal key={i} direction="up" delay={(i % 3) * 70}>
                <div className="h-full rounded-3xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur transition-colors hover:bg-white/[0.1]">
                  <div className="text-2xl">{s.icon}</div>
                  <h4 className="mt-3 font-bold">{t(s.title)}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">
                    {t(s.desc)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>

        {/* Quote */}
        <Reveal direction="up" className="mt-12">
          <blockquote className="mx-auto max-w-3xl border-l-4 border-gold-400 bg-white/[0.06] p-6 italic backdrop-blur sm:p-8">
            <p className="text-pretty text-lg leading-relaxed text-white/90">
              {t(blood.quote)}
            </p>
          </blockquote>
        </Reveal>

        {/* CTA */}
        <Reveal direction="up" className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button href={shantichakraGroup} variant="light" size="lg">
            <Facebook className="h-4 w-4" />
            {t(blood.cta.join)}
          </Button>
          <Button href="#contact" size="lg" className="bg-white/10 text-white ring-1 ring-inset ring-white/30 hover:bg-white/15">
            <MessageCircle className="h-4 w-4" />
            {t(blood.cta.donate)}
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}
