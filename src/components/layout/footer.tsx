"use client";

import {
  Facebook,
  Instagram,
  Mail,
  MessageCircle,
  Phone,
  MapPin,
  Youtube,
  Heart,
} from "lucide-react";
import { footer } from "@/content/contact";
import {
  navLinks,
  secondaryLinks,
  site,
  socials,
  shantichakraGroup,
} from "@/lib/site";
import { useLanguage } from "@/components/providers/language-provider";
import { ExperienceSwitch } from "@/components/experience/experience-switch";
import { Container } from "@/components/ui/primitives";

const socialIcons: Record<string, typeof Facebook> = {
  facebook: Facebook,
  tiktok: MessageCircle,
  youtube: Youtube,
  instagram: Instagram,
};

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-10 border-t border-border/10 bg-canvas-subtle/60">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="#home" className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">
                {site.initials}
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-semibold">{t(site.name)}</span>
                <span className="text-[11px] text-fg-muted">{t(site.role)}</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-pretty text-sm leading-relaxed text-fg-soft">
              {t(footer.tagline)}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-gold-500/15 px-3 py-1 text-xs font-semibold text-gold-600 ring-1 ring-inset ring-gold-500/30 dark:text-gold-400">
                A+ Blood Donor
              </span>
              <span className="rounded-full bg-canvas-muted px-3 py-1 text-xs font-semibold text-fg-soft ring-1 ring-inset ring-border/10">
                BNCC Cadet
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-fg-muted">
              {t(footer.quickLinksTitle)}
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={`/${link.href}`}
                    className="text-fg-soft transition-colors hover:text-brand-600 dark:hover:text-brand-400"
                  >
                    {t(link)}
                  </a>
                </li>
              ))}
            </ul>

            <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-fg-muted">
              {t({ bn: "আরও", en: "More" })}
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {secondaryLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-fg-soft transition-colors hover:text-brand-600 dark:hover:text-brand-400"
                  >
                    {t(link)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-fg-muted">
              {t(footer.contactTitle)}
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              <li>
                <a href={`mailto:${site.email}`} className="group flex items-center gap-2.5 text-fg-soft hover:text-fg">
                  <Mail className="h-4 w-4 text-fg-muted" />
                  <span className="break-all">{site.email}</span>
                </a>
              </li>
              <li>
                <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-fg-soft hover:text-fg">
                  <MessageCircle className="h-4 w-4 text-fg-muted" />
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`tel:${site.phoneHref}`} className="flex items-center gap-2.5 text-fg-soft hover:text-fg">
                  <Phone className="h-4 w-4 text-fg-muted" />
                  {site.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-fg-soft">
                <MapPin className="h-4 w-4 text-fg-muted" />
                {t(site.location)}
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-fg-muted">
              {t(footer.socialTitle)}
            </h3>
            <p className="mt-4 text-sm text-fg-soft">{t(footer.socialText)}</p>
            <div className="mt-3 flex gap-2">
              {socials.map((s) => {
                const Icon = socialIcons[s.key] ?? Facebook;
                return (
                  <a
                    key={s.key}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="grid h-10 w-10 place-items-center rounded-xl border border-border/10 bg-surface text-fg-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500/30 hover:text-brand-600 dark:hover:text-brand-400"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
            <a
              href={shantichakraGroup}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/[0.06] px-4 py-2 text-xs font-semibold text-brand-600 transition-colors hover:bg-brand-500/10 dark:text-brand-400"
            >
              🩸 {t(footer.bloodLink)}
            </a>
          </div>
        </div>

        {/* Two experiences, one story — switch any time */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-3xl border border-border/10 bg-surface/70 px-6 py-5 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold">
              {t({
                bn: "একই তথ্য — দুই রকম অভিজ্ঞতা",
                en: "Same story — two experiences",
              })}
            </p>
            <p className="mt-0.5 text-xs text-fg-muted">
              {t({
                bn: "ওয়েবসাইট আর রাহাতভার্সে সবকিছু একই, শুধু উপস্থাপনা আলাদা।",
                en: "The website and RahatVerse share everything — only the presentation differs.",
              })}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-center gap-2">
            <ExperienceSwitch
              to="verse"
              variant="solid"
              label={t({ bn: "রাহাতভার্সে ঢুকুন", en: "Enter RahatVerse" })}
            />
            <a
              href="/enter"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border/15 bg-surface/60 px-5 text-xs font-semibold text-fg-soft transition-all hover:border-brand-500/40 hover:text-fg"
            >
              {t({ bn: "অভিজ্ঞতা বদলান", en: "Change experience" })}
            </a>
          </div>
        </div>

        <div className="my-8 h-px hairline" />

        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <p className="text-sm text-fg-soft">
              © {year} <strong className="font-semibold text-fg">Rahat Ahmed</strong>{" "}
              {t(footer.rights)}
            </p>
            <p className="mt-1 inline-flex items-center justify-center gap-1.5 text-xs text-fg-muted">
              {t(footer.madeWith)}
              <Heart className="h-3 w-3 fill-brand-500 text-brand-500" />
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-fg-muted">{site.version}</span>
            <a
              href="#home"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-400"
            >
              <span className="link-underline">{t(footer.backToTop)}</span>
              <span className="transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
