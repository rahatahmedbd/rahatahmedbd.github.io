"use client";

import { tribute } from "@/content/tribute";
import { useLanguage } from "@/components/providers/language-provider";
import { Container, Reveal, Section, Eyebrow } from "@/components/ui/primitives";

export function Tribute() {
  const { t } = useLanguage();

  return (
    <Section id="tribute" className="overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[#17120e]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(201,154,62,0.10),transparent_70%)]" />

      <Container size="narrow" className="relative text-center">
        {/* Opening */}
        <Reveal direction="fade">
          <p className="text-2xl text-gold-400 sm:text-3xl">
            ۞ {t(tribute.inna)} ۞
          </p>
          <p className="mx-auto mt-3 max-w-xl text-pretty leading-relaxed text-white/65">
            {t(tribute.innaTranslation)}
          </p>
        </Reveal>

        <Reveal direction="fade" className="mt-10 flex justify-center">
          <Eyebrow tone="gold">{t(tribute.eyebrow)}</Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-4 text-display-lg font-bold tracking-tight text-white">
            {t(tribute.title)}
          </h2>
        </Reveal>

        {/* Portrait */}
        <Reveal direction="scale" className="mt-10 flex flex-col items-center">
          <div className="relative aspect-[3/4] w-48 overflow-hidden rounded-4xl border border-gold-500/30 shadow-lift sm:w-56">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tribute.photoSrc}
              alt={tribute.photoAlt}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          <h3 className="mt-5 text-xl font-bold text-white">{t(tribute.name)}</h3>
          <p className="text-gold-400">{t(tribute.relation)}</p>
          <p className="mt-1 text-sm text-white/55">{t(tribute.date)}</p>
        </Reveal>

        {/* Intro */}
        <Reveal direction="up" className="mt-10">
          <p className="mx-auto max-w-2xl text-pretty leading-relaxed text-white/75">
            {t(tribute.intro)}
          </p>
        </Reveal>

        {/* Identity roles */}
        <Reveal direction="up" className="mt-12">
          <h3 className="flex items-center justify-center gap-3 text-lg font-bold text-gold-400">
            <span>✦</span>
            {t(tribute.identityTitle)}
            <span>✦</span>
          </h3>
          <div className="mt-6 grid gap-3 text-left sm:grid-cols-2">
            {tribute.roles.map((role, i) => (
              <Reveal key={i} direction="up" delay={(i % 2) * 70}>
                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <span className="text-xl">{role.icon}</span>
                  <div>
                    <div className="font-semibold text-gold-400">{t(role.title)}</div>
                    <div className="text-sm text-white/75">{t(role.meta)}</div>
                    {role.period && (
                      <div className="mt-0.5 text-xs text-white/45">{t(role.period)}</div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>

        {/* Works */}
        <Reveal direction="up" className="mt-12">
          <h3 className="flex items-center justify-center gap-3 text-lg font-bold text-gold-400">
            <span>✦</span>
            {t(tribute.worksTitle)}
            <span>✦</span>
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-pretty leading-relaxed text-white/70">
            {t(tribute.worksIntro)}
          </p>
          <div className="mx-auto mt-6 grid max-w-3xl gap-2 text-left">
            {tribute.works.map((work, i) => (
              <Reveal key={i} direction="up" delay={(i % 5) * 50}>
                <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gold-500/15 text-xs font-bold text-gold-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm leading-relaxed text-white/80">
                    {t(work)}
                  </span>
                </div>
              </Reveal>
            ))}
            <p className="mt-1 text-center text-sm italic text-white/45">
              {t(tribute.worksMore)}
            </p>
          </div>
        </Reveal>

        {/* Farewell */}
        <Reveal direction="up" className="mt-12">
          <p className="mx-auto max-w-2xl text-pretty leading-relaxed text-white/75">
            {t(tribute.farewell)}
          </p>
        </Reveal>

        {/* Dua */}
        <Reveal direction="fade" className="mt-10">
          <div className="mx-auto max-w-2xl rounded-4xl border border-gold-500/20 bg-gold-500/[0.06] p-7 sm:p-8">
            <div className="text-3xl">🤲</div>
            <p className="mt-3 text-pretty leading-relaxed text-gold-400">
              {t(tribute.dua)}
            </p>
          </div>
        </Reveal>

        {/* Signature */}
        <Reveal direction="fade" className="mt-8">
          <p className="text-white/70">۞ {t(tribute.signature)}</p>
        </Reveal>
      </Container>
    </Section>
  );
}
