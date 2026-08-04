"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Expand, ImageOff } from "lucide-react";
import { gallery } from "@/content/gallery";
import { useLanguage } from "@/components/providers/language-provider";
import {
  Container,
  Reveal,
  Section,
  SectionHeading,
} from "@/components/ui/primitives";
import { Lightbox, type LightboxItem } from "@/components/ui/lightbox";
import { cn } from "@/lib/utils";

/** Map a badge emoji onto one of the four content categories. */
const badgeCategory: Record<string, string> = {
  "🏆": "Achievements",
  "🥇": "Achievements",
  "🎗️": "Achievements",
  "🧠": "Achievements",
  "🩸": "Blood Donation",
  "🏫": "Education",
  "🤝": "Social Work",
};

export function Gallery() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<string>("all");
  const [index, setIndex] = useState<number | null>(null);

  const items = useMemo(
    () =>
      gallery.items.filter(
        (item) => filter === "all" || badgeCategory[item.badge] === filter
      ),
    [filter]
  );

  /* Only real, present photos can open in the lightbox. */
  const viewable: LightboxItem[] = useMemo(
    () =>
      items
        .filter((item) => !item.missing)
        .map((item) => ({
          src: item.src,
          alt: item.alt,
          title: t(item.title),
          meta: t(item.meta),
        })),
    [items, t]
  );

  const openAt = (src: string) => {
    const i = viewable.findIndex((v) => v.src === src);
    if (i >= 0) setIndex(i);
  };

  return (
    <Section id="gallery">
      <Container>
        <SectionHeading
          eyebrow={t(gallery.eyebrow)}
          title={t(gallery.title)}
          subtitle={t(gallery.subtitle)}
        />

        {/* Category filters */}
        <Reveal direction="fade" className="mt-8">
          <div className="no-scrollbar -mx-1 flex justify-start gap-2 overflow-x-auto px-1 pb-1 sm:justify-center">
            <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
              ✨ {t({ bn: "সব", en: "All" })}
            </FilterChip>
            {gallery.categories.map((c) => (
              <FilterChip
                key={c.label.en}
                active={filter === c.label.en}
                onClick={() => setFilter(c.label.en)}
              >
                <span>{c.icon}</span>
                {t(c.label)}
              </FilterChip>
            ))}
          </div>
        </Reveal>

        {/* Grid */}
        {items.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-border/20 p-12 text-center">
            <ImageOff className="mx-auto h-8 w-8 text-fg-muted/50" />
            <p className="mt-3 text-sm font-semibold text-fg">
              {t({ en: "Nothing in this category yet", bn: "এই ক্যাটাগরিতে এখনো কিছু নেই" })}
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {items.map((item, i) => {
              const missing = Boolean(item.missing);
              return (
                <Reveal key={item.src} direction="scale" delay={(i % 4) * 50}>
                  <button
                    type="button"
                    disabled={missing}
                    onClick={() => openAt(item.src)}
                    aria-label={missing ? item.alt : `${t(item.title)} — open`}
                    className={cn(
                      "group relative block aspect-square w-full overflow-hidden rounded-3xl border border-border/10 bg-surface text-left",
                      missing
                        ? "cursor-default"
                        : "press transition-all duration-500 ease-premium hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-lift"
                    )}
                  >
                    {missing ? (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-canvas-muted to-surface text-fg-muted">
                        <span className="text-3xl opacity-40">{item.badge}</span>
                        <span className="px-3 text-center text-[10px] uppercase tracking-wide opacity-50">
                          {t({ bn: "শীঘ্রই আসছে", en: "Coming soon" })}
                        </span>
                      </div>
                    ) : (
                      <>
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          loading="lazy"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.07]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                        <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                          <Expand className="h-4 w-4" />
                        </span>
                      </>
                    )}

                    <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-3 sm:p-4">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-xs backdrop-blur">
                        {item.badge}
                      </span>
                      {!missing && (
                        <span className="mt-2 text-white">
                          <span className="block text-[13px] font-bold leading-tight">
                            {t(item.title)}
                          </span>
                          <span className="block text-[11px] text-white/75">{t(item.meta)}</span>
                        </span>
                      )}
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </div>
        )}

        {/* Info */}
        <Reveal direction="fade" className="mt-10 flex flex-col items-center gap-2 text-center">
          <p className="max-w-xl text-pretty text-fg-soft">{t(gallery.info.text)}</p>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-400"
          >
            <span className="link-underline">{t(gallery.info.cta)}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </Reveal>
      </Container>

      <Lightbox
        items={viewable}
        index={index}
        onClose={() => setIndex(null)}
        onIndexChange={setIndex}
      />
    </Section>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "press inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-all sm:text-sm",
        active
          ? "border-brand-500/40 bg-brand-500/12 text-brand-600 dark:text-brand-400"
          : "border-border/15 text-fg-soft hover:border-brand-500/25 hover:text-fg"
      )}
    >
      {children}
    </button>
  );
}
