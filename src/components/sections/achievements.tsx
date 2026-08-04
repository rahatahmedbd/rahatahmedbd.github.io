"use client";

import { achievements } from "@/content/achievements";
import { useLanguage } from "@/components/providers/language-provider";
import { useCountUp } from "@/hooks/use-count-up";
import {
  Container,
  Reveal,
  Section,
  SectionHeading,
  Badge,
  Chip,
} from "@/components/ui/primitives";

function Stat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: boolean;
  label: { bn: string; en: string };
}) {
  const { t, lang } = useLanguage();
  const { ref, display } = useCountUp(value, lang);
  return (
    <div className="card-surface rounded-3xl p-6 text-center transition-all duration-500 ease-premium hover:-translate-y-1 hover:border-brand-500/25 hover:shadow-lift">
      <div className="text-display-lg font-bold tabular-nums text-gradient-brand">
        <span ref={ref}>
          {display}
          {suffix ? "+" : ""}
        </span>
      </div>
      <div className="mt-1 text-sm font-medium text-fg-muted">{t(label)}</div>
    </div>
  );
}

function TagRenderer({ tag }: { tag: string | { bn: string; en: string } }) {
  const { t } = useLanguage();
  return (
    <Chip
      tone={
        typeof tag === "object" && tag.en === "Honored"
          ? "brand"
          : "default"
      }
    >
      {typeof tag === "string" ? tag : t(tag)}
    </Chip>
  );
}

export function Achievements() {
  const { t } = useLanguage();

  return (
    <Section id="achievements">
      <Container>
        <SectionHeading
          eyebrow={t(achievements.eyebrow)}
          title={t(achievements.title)}
          subtitle={t(achievements.subtitle)}
        />

        {/* Stats */}
        <Reveal direction="up" className="mt-12">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {achievements.stats.map((s) => (
              <Stat key={s.label.en} {...s} />
            ))}
          </div>
        </Reveal>

        {/* Featured */}
        <Reveal direction="up" className="mt-8">
          <article className="relative overflow-hidden rounded-4xl border border-brand-500/20 bg-gradient-to-br from-brand-600/[0.08] via-surface to-surface p-7 shadow-soft sm:p-9">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-600/10 blur-3xl" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 text-3xl shadow-soft">
                🏆
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone="gold">{t(achievements.featured.badge)}</Badge>
                  <span className="text-xs font-medium text-fg-muted">
                    {t(achievements.featured.date)}
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-bold tracking-tight sm:text-2xl">
                  {t(achievements.featured.title)}
                </h3>
                <p className="mt-2 max-w-2xl text-pretty leading-relaxed text-fg-soft">
                  {t(achievements.featured.desc)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {achievements.featured.tags.map((tag, idx) => (
                    <TagRenderer key={idx} tag={tag} />
                  ))}
                </div>
              </div>
            </div>
          </article>
        </Reveal>

        {/* Cards — a swipeable rail on phones, a grid from sm upward */}
        <div className="no-scrollbar snap-rail mt-8 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3">
          {achievements.cards.map((card, i) => (
            <Reveal
              key={i}
              direction="up"
              delay={(i % 3) * 80}
              className="snap-item w-[82%] shrink-0 sm:w-auto"
            >
              <article className="card-surface group h-full rounded-3xl p-6 transition-all duration-500 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-lift">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-canvas-muted text-xl transition-transform duration-300 group-hover:scale-110">
                    {card.icon}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
                    {t(card.year)}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold leading-snug tracking-tight">
                  {t(card.title)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-soft">
                  {t(card.desc)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {card.badge && (
                    <Badge
                      tone={
                        card.tone === "gold"
                          ? "gold"
                          : card.tone === "success"
                          ? "success"
                          : "default"
                      }
                    >
                      {typeof card.badge === "string" ? card.badge : t(card.badge)}
                    </Badge>
                  )}
                  {card.badges?.map((b) => (
                    <Badge key={b}>{b}</Badge>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal direction="up" className="mt-10 text-center">
          <p className="mx-auto max-w-2xl text-pretty text-fg-soft">
            {t(achievements.cta)}
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
