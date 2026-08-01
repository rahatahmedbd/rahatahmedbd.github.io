"use client";

import { gallery } from "@/content/gallery";
import { useLanguage } from "@/components/providers/language-provider";
import {
  Container,
  Reveal,
  Section,
  SectionHeading,
  Chip,
} from "@/components/ui/primitives";

export function Gallery() {
  const { t } = useLanguage();

  return (
    <Section id="gallery">
      <Container>
        <SectionHeading
          eyebrow={t(gallery.eyebrow)}
          title={t(gallery.title)}
          subtitle={t(gallery.subtitle)}
        />

        {/* Categories */}
        <Reveal direction="fade" className="mt-8 flex flex-wrap justify-center gap-2">
          {gallery.categories.map((c) => (
            <Chip key={c.label.en} tone="outline">
              <span>{c.icon}</span>
              {t(c.label)}
            </Chip>
          ))}
        </Reveal>

        {/* Grid */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {gallery.items.map((item, i) => (
            <Reveal key={i} direction="scale" delay={(i % 4) * 60}>
              <figure className="group relative aspect-square overflow-hidden rounded-3xl border border-border/10 bg-surface">
                {item.missing ? (
                  // Graceful placeholder for photos not yet committed
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-canvas-muted to-surface text-fg-muted">
                    <span className="text-3xl opacity-40">{item.badge}</span>
                    <span className="px-3 text-center text-[10px] uppercase tracking-wide opacity-50">
                      {t({ bn: "শীঘ্রই আসছে", en: "Coming soon" })}
                    </span>
                  </div>
                ) : (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-90" />
                  </>
                )}

                <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-4">
                  <div className="pointer-events-auto">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-sm backdrop-blur">
                      {item.badge}
                    </span>
                    <figcaption className="mt-2 translate-y-1 text-white opacity-0 transition-all duration-500 ease-premium group-hover:translate-y-0 group-hover:opacity-100">
                      <h3 className="text-sm font-bold leading-tight">
                        {t(item.title)}
                      </h3>
                      <p className="text-xs text-white/80">{t(item.meta)}</p>
                    </figcaption>
                  </div>
                </div>
              </figure>
            </Reveal>
          ))}
        </div>

        {/* Info */}
        <Reveal direction="fade" className="mt-10 flex flex-col items-center gap-2 text-center">
          <p className="max-w-xl text-pretty text-fg-soft">
            {t(gallery.info.text)}
          </p>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-400"
          >
            <span className="link-underline">{t(gallery.info.cta)}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </Reveal>
      </Container>
    </Section>
  );
}
