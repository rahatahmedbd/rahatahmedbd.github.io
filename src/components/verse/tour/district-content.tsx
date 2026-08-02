"use client";

import { useState } from "react";
import {
  Award,
  Briefcase,
  Calendar,
  CheckCircle2,
  Droplet,
  ExternalLink,
  Facebook,
  Heart,
  Instagram,
  LayoutDashboard,
  LogIn,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Quote,
  Send,
  Sparkles,
  Youtube,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { OrderFlow } from "@/components/order/order-flow";
import { about } from "@/content/about";
import { achievements } from "@/content/achievements";
import { blood } from "@/content/blood";
import { contact as contactContent } from "@/content/contact";
import { education } from "@/content/education";
import { experience } from "@/content/experience";
import { gallery } from "@/content/gallery";
import { tribute } from "@/content/tribute";
import { formspreeEndpoint, shantichakraGroup, site, socials } from "@/lib/site";
import { HoloCard, PanelLink, PanelSection, StatGrid } from "./panel-shell";
import type { DistrictId } from "./districts";
import type { VerseData } from "./types";

/**
 * District content = website content. Every section of the classic site has
 * an address in the city, and every action (ordering, contacting, logging in)
 * works from right here.
 */
export function DistrictContent({
  id,
  data,
  onOrdered,
}: {
  id: DistrictId;
  data: VerseData;
  onOrdered?: (ref: string) => void;
}) {
  switch (id) {
    case "headquarters":
      return <HeadquartersContent />;
    case "store":
      return <StoreContent onOrdered={onOrdered} />;
    case "museum":
      return <MuseumContent data={data} />;
    case "service":
      return <ServiceContent data={data} />;
    case "lab":
      return <LabContent data={data} />;
    case "blood":
      return <BloodContent />;
    case "achievements":
      return <AchievementsContent />;
    case "contact":
      return <ContactContent />;
    case "mission-control":
      return <MissionControlContent data={data} />;
    default:
      return null;
  }
}

/* ── 1 · Agency Headquarters — About, mission, education, tribute ──────── */

function HeadquartersContent() {
  const { t } = useLanguage();

  return (
    <>
      <PanelSection>
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/profile.jpg"
            alt="Rahat Ahmed"
            className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-1 ring-white/15"
            loading="lazy"
          />
          <div className="min-w-0">
            <h3 className="text-lg font-bold tracking-tight">{t(site.name)}</h3>
            <p className="text-xs text-white/50">
              {t(about.badge.title)} · {t(about.badge.sub)}
            </p>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-white/40">
              <MapPin className="h-3 w-3" />
              {t(site.location)}
            </p>
          </div>
        </div>
      </PanelSection>

      <PanelSection>
        <HoloCard className="border-brand-500/25 bg-brand-500/[0.06]">
          <Quote className="h-4 w-4 text-brand-400" />
          <p className="mt-2 text-sm italic leading-relaxed text-white/80">{t(about.quote)}</p>
        </HoloCard>
      </PanelSection>

      <PanelSection title={t(about.title)}>
        <div className="space-y-3 text-sm leading-relaxed text-white/65">
          {about.story.map((p, i) => (
            <p key={i}>{t(p)}</p>
          ))}
        </div>
      </PanelSection>

      <PanelSection title={t({ en: "Verified facts", bn: "যাচাইকৃত তথ্য" })}>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {about.facts.map((f) => (
            <div
              key={f.label.en}
              className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5"
            >
              <span className="text-base">{f.icon}</span>
              <span className="min-w-0">
                <span className="block text-[10px] uppercase tracking-wide text-white/35">
                  {t(f.label)}
                </span>
                <span className="block truncate text-xs font-semibold">{t(f.value)}</span>
              </span>
            </div>
          ))}
        </div>
      </PanelSection>

      <PanelSection title={t(education.title)}>
        <ol className="relative space-y-3 border-l border-white/10 pl-4">
          {education.milestones.map((m, i) => (
            <li key={i} className="relative">
              <span
                className={`absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full ${
                  m.active ? "bg-brand-500 ring-4 ring-brand-500/20" : "bg-white/25"
                }`}
              />
              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold">
                    {m.icon} {t(m.title)}
                  </span>
                  {m.badge && (
                    <span className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-300">
                      {m.badge}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[11px] text-white/45">
                  {t(m.period)} · {t(m.institution)}
                </p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-white/55">{t(m.desc)}</p>
                {m.tags && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {m.tags.map((tag, ti) => (
                      <span
                        key={ti}
                        className="rounded-full bg-white/8 px-2 py-0.5 text-[9px] text-white/60"
                      >
                        {t(tag)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </PanelSection>

      {/* Tribute memorial — preserved in full */}
      <PanelSection title={t(tribute.title)}>
        <HoloCard className="border-gold-500/25 bg-gold-500/[0.05]">
          <p className="text-center text-xs font-semibold text-gold-400">{t(tribute.inna)}</p>
          <p className="mt-1 text-center text-[10px] text-white/40">{t(tribute.innaTranslation)}</p>

          <div className="mt-4 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tribute.photoSrc}
              alt={tribute.photoAlt}
              className="h-14 w-14 rounded-xl object-cover ring-1 ring-gold-500/30"
              loading="lazy"
            />
            <div className="min-w-0">
              <p className="text-sm font-bold">{t(tribute.name)}</p>
              <p className="text-[11px] text-white/45">{t(tribute.relation)}</p>
              <p className="text-[10px] text-white/35">{t(tribute.date)}</p>
            </div>
          </div>

          <p className="mt-3 text-[11px] leading-relaxed text-white/60">{t(tribute.intro)}</p>

          <div className="mt-3 space-y-1.5">
            {tribute.roles.map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px]">
                <span>{r.icon}</span>
                <span className="min-w-0">
                  <span className="font-semibold text-white/80">{t(r.title)}</span>
                  <span className="text-white/40"> — {t(r.meta)}</span>
                  {r.period && <span className="block text-[10px] text-white/30">{t(r.period)}</span>}
                </span>
              </div>
            ))}
          </div>

          <details className="mt-3 group">
            <summary className="cursor-pointer list-none text-[11px] font-semibold text-gold-400 transition hover:text-gold-300">
              {t(tribute.worksTitle)} ▾
            </summary>
            <p className="mt-2 text-[11px] leading-relaxed text-white/50">{t(tribute.worksIntro)}</p>
            <ul className="mt-2 space-y-1">
              {tribute.works.map((w, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[11px] text-white/55">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-gold-500" />
                  {t(w)}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[10px] italic text-white/35">{t(tribute.worksMore)}</p>
            <p className="mt-3 text-[11px] leading-relaxed text-white/55">{t(tribute.farewell)}</p>
            <p className="mt-2 text-[11px] leading-relaxed text-gold-400/80">{t(tribute.dua)}</p>
            <p className="mt-2 text-[10px] text-white/35">{t(tribute.signature)}</p>
          </details>
        </HoloCard>
      </PanelSection>
    </>
  );
}

/* ── 2 · Website Store — packages + the real order flow ────────────────── */

function StoreContent({ onOrdered }: { onOrdered?: (ref: string) => void }) {
  const { t } = useLanguage();

  return (
    <>
      <PanelSection>
        <HoloCard className="border-cyan-400/25 bg-cyan-400/[0.06]">
          <p className="flex items-center gap-2 text-xs font-bold text-cyan-300">
            <Sparkles className="h-3.5 w-3.5" />
            {t({ en: "Fully functional — order right here", bn: "সম্পূর্ণ কার্যকর — এখান থেকেই অর্ডার করুন" })}
          </p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-white/55">
            {t({
              en: "This is the same order system as the website. Your draft is saved as you go, so you can finish it anywhere.",
              bn: "এটি ওয়েবসাইটের একই অর্ডার সিস্টেম। আপনার ড্রাফট সেভ হতে থাকে, তাই যেকোনো জায়গা থেকে শেষ করতে পারবেন।",
            })}
          </p>
        </HoloCard>
      </PanelSection>

      <OrderFlow variant="verse" onSubmitted={(ref) => onOrdered?.(ref)} />
    </>
  );
}

/* ── 3 · Portfolio Museum — projects, experience, gallery ──────────────── */

function MuseumContent({ data }: { data: VerseData }) {
  const { t, lang } = useLanguage();
  const projects = data.projects ?? [];

  return (
    <>
      {projects.length > 0 && (
        <PanelSection title={t({ en: "Projects", bn: "প্রজেক্টসমূহ" })}>
          <div className="space-y-2.5">
            {projects.map((p) => (
              <HoloCard key={p.id}>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold">{p.title}</h4>
                  {p.categories?.name && (
                    <span className="shrink-0 rounded-full bg-white/8 px-2 py-0.5 text-[9px] text-white/55">
                      {p.categories.name}
                    </span>
                  )}
                </div>
                {p.description && (
                  <p className="mt-1.5 text-[11px] leading-relaxed text-white/55">{p.description}</p>
                )}
                {(p.live_url || p.repo_url) && (
                  <div className="mt-2 flex gap-2">
                    {p.live_url && (
                      <a
                        href={p.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold transition hover:bg-white/20"
                      >
                        {t({ en: "Live", bn: "লাইভ" })} <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                    {p.repo_url && (
                      <a
                        href={p.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold transition hover:bg-white/20"
                      >
                        {t({ en: "Code", bn: "কোড" })} <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>
                )}
              </HoloCard>
            ))}
          </div>
        </PanelSection>
      )}

      <PanelSection title={t(experience.title)}>
        <p className="mb-3 text-[11px] leading-relaxed text-white/50">{t(experience.subtitle)}</p>
        <div className="space-y-2.5">
          {experience.initiatives.map((init, i) => (
            <HoloCard key={i}>
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-bold">
                  {init.icon} {t(init.title)}
                </span>
                <span className="shrink-0 rounded-full bg-white/8 px-2 py-0.5 text-[9px] text-white/55">
                  {t(init.status)}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-brand-400">{t(init.role)}</p>
              <p className="mt-0.5 text-[10px] text-white/35">{t(init.date)}</p>
              <p className="mt-2 text-[11px] leading-relaxed text-white/55">{t(init.desc)}</p>
              <dl className="mt-2 space-y-1">
                {init.details.map((d, di) => (
                  <div key={di} className="flex gap-1.5 text-[10px]">
                    <dt className="shrink-0 text-white/35">{t(d.label)}</dt>
                    <dd className="text-white/60">{t(d.value)}</dd>
                  </div>
                ))}
              </dl>
              {init.note && <p className="mt-2 text-[10px] italic text-white/40">{t(init.note)}</p>}
              {init.link && (
                <a
                  href={init.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-cyan-300 hover:text-cyan-200"
                >
                  {t(init.link.label)} <ExternalLink className="h-2.5 w-2.5" />
                </a>
              )}
            </HoloCard>
          ))}
        </div>
      </PanelSection>

      <PanelSection title={t(experience.rolesDivider)}>
        <div className="grid gap-2 sm:grid-cols-2">
          {experience.roles.map((r, i) => (
            <div
              key={i}
              className={`rounded-xl border p-3 ${
                r.tone === "blood" ? "border-brand-500/25 bg-brand-500/[0.06]" : "border-white/8 bg-white/[0.03]"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{r.icon}</span>
                <span className="text-xs font-bold">{t(r.title)}</span>
              </div>
              <p className="mt-0.5 text-[10px] text-white/40">{t(r.since)}</p>
              <p className="mt-1.5 text-[10px] leading-relaxed text-white/50">{t(r.desc)}</p>
            </div>
          ))}
        </div>
      </PanelSection>

      <PanelSection title={t(gallery.title)}>
        <div className="grid grid-cols-2 gap-2">
          {gallery.items
            .filter((g) => !g.missing)
            .map((g) => (
              <figure key={g.src} className="overflow-hidden rounded-xl border border-white/8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.src} alt={g.alt} className="h-24 w-full object-cover" loading="lazy" />
                <figcaption className="bg-black/40 px-2 py-1.5">
                  <span className="block truncate text-[10px] font-semibold">
                    {g.badge} {t(g.title)}
                  </span>
                  <span className="block truncate text-[9px] text-white/40">{t(g.meta)}</span>
                </figcaption>
              </figure>
            ))}
        </div>
      </PanelSection>

      <PanelLink href="/museum" accent="#d4af37">
        <span className="text-xs font-semibold">
          {t({ en: "Open the full 3D Portfolio Museum", bn: "সম্পূর্ণ থ্রিডি পোর্টফোলিও জাদুঘর খুলুন" })}
        </span>
      </PanelLink>
    </>
  );
}

/* ── 4 · Service Center — services ─────────────────────────────────────── */

function ServiceContent({ data }: { data: VerseData }) {
  const { t, lang } = useLanguage();
  const services =
    data.services && data.services.length > 0
      ? data.services
      : [
          {
            id: "web",
            title_en: "Web Development",
            title_bn: "ওয়েব ডেভেলপমেন্ট",
            description_en: "Premium, secure and modern full-stack web application development services.",
            description_bn: "উন্নত, নিরাপদ এবং আধুনিক ওয়েব অ্যাপ্লিকেশন ডেভেলপমেন্ট সেবা।",
            icon: "Code",
          },
          {
            id: "tutor",
            title_en: "Home Tutoring",
            title_bn: "গৃহ শিক্ষকতা",
            description_en: "Experienced tutoring in science and computer subjects for school and college students.",
            description_bn: "বিজ্ঞান এবং কম্পিউটার বিষয়ে স্কুল ও কলেজ শিক্ষার্থীদের জন্য অভিজ্ঞ গৃহ শিক্ষকতা।",
            icon: "GraduationCap",
          },
          {
            id: "social",
            title_en: "Social SBS Volunteer",
            title_bn: "রক্তদান ও সমাজসেবা",
            description_en: "Active blood donation leader and volunteer in Sunamganj Shantichakra Blood Society.",
            description_bn: "সুনামগঞ্জ শান্তিচক্র ব্লাড সোসাইটিতে সক্রিয় রক্তদান লিডার ও সমাজসেবামূলক কর্মকাণ্ড।",
            icon: "Heart",
          },
        ];

  const web = experience.services;

  return (
    <>
      <PanelSection title={t({ en: "Services", bn: "সেবাসমূহ" })}>
        <div className="space-y-2.5">
          {services.map((s: any) => (
            <HoloCard key={s.id}>
              <h4 className="text-sm font-bold">{lang === "bn" ? s.title_bn : s.title_en}</h4>
              <p className="mt-1 text-[11px] leading-relaxed text-white/55">
                {lang === "bn" ? s.description_bn : s.description_en}
              </p>
            </HoloCard>
          ))}
        </div>
      </PanelSection>

      <PanelSection title={t(web.title)}>
        <HoloCard>
          <p className="text-xs font-semibold text-lime-300">{t(web.subtitle)}</p>
          <p className="mt-2 text-[11px] leading-relaxed text-white/55">{t(web.desc)}</p>

          <p className="mt-3 text-[10px] font-bold uppercase tracking-wide text-white/35">
            {t(web.typesLabel)}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {web.types.map((ty, i) => (
              <span key={i} className="rounded-full bg-white/8 px-2.5 py-1 text-[10px] text-white/65">
                {t(ty)}
              </span>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {web.features.map((f, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[10px] text-white/60">
                <span>{f.icon}</span>
                {t(f.label)}
              </div>
            ))}
          </div>
        </HoloCard>
      </PanelSection>

      <PanelLink href="/order" accent="#a3e635">
        <span className="text-xs font-semibold">
          {t({ en: "Order a website (or drive to the Website Store)", bn: "ওয়েবসাইট অর্ডার করুন (বা ওয়েবসাইট স্টোরে যান)" })}
        </span>
      </PanelLink>
    </>
  );
}

/* ── 5 · Innovation Lab — skills + FAQs ────────────────────────────────── */

function LabContent({ data }: { data: VerseData }) {
  const { t, lang } = useLanguage();
  const skills = data.skills ?? [];
  const faqs = data.faqs ?? [];

  const fallbackSkills = [
    { id: "1", name: "Next.js / React", level: 88, category: "Frontend" },
    { id: "2", name: "TypeScript", level: 82, category: "Frontend" },
    { id: "3", name: "Tailwind CSS", level: 90, category: "Frontend" },
    { id: "4", name: "Supabase / PostgreSQL", level: 78, category: "Backend" },
    { id: "5", name: "AI-assisted development", level: 85, category: "Tools" },
    { id: "6", name: "SEO & Performance", level: 84, category: "Tools" },
  ];
  const list: any[] = skills.length > 0 ? skills : fallbackSkills;

  return (
    <>
      <PanelSection title={t({ en: "Skills & stack", bn: "দক্ষতা ও প্রযুক্তি" })}>
        <div className="space-y-2.5">
          {list.map((s: any) => {
            const level = Number(s.level ?? s.proficiency ?? 80);
            return (
              <div key={s.id ?? s.name}>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold">{s.name ?? s.title}</span>
                  <span className="text-white/40">{level}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400"
                    style={{ width: `${Math.min(100, Math.max(0, level))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </PanelSection>

      {faqs.length > 0 && (
        <PanelSection title={t({ en: "Frequently asked", bn: "সাধারণ প্রশ্নোত্তর" })}>
          <div className="space-y-2">
            {faqs.map((f: any) => (
              <details
                key={f.id}
                className="rounded-xl border border-white/8 bg-white/[0.03] px-3.5 py-2.5"
              >
                <summary className="cursor-pointer list-none text-xs font-semibold text-white/80">
                  {f.question}
                </summary>
                <p className="mt-2 text-[11px] leading-relaxed text-white/55">{f.answer}</p>
              </details>
            ))}
          </div>
        </PanelSection>
      )}

      <PanelSection title={t({ en: "How I work", bn: "কাজের ধরন" })}>
        <div className="grid grid-cols-2 gap-2">
          {[
            { en: "Idea & research", bn: "ধারণা ও গবেষণা" },
            { en: "Planning", bn: "পরিকল্পনা" },
            { en: "Design", bn: "ডিজাইন" },
            { en: "Development", bn: "ডেভেলপমেন্ট" },
            { en: "Testing", bn: "টেস্টিং" },
            { en: "Optimization", bn: "অপটিমাইজেশন" },
            { en: "Deployment", bn: "ডিপ্লয়মেন্ট" },
            { en: "Support", bn: "সাপোর্ট" },
          ].map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-[11px]"
            >
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet-500/20 text-[9px] font-bold text-violet-300">
                {i + 1}
              </span>
              {t(s)}
            </div>
          ))}
        </div>
      </PanelSection>
    </>
  );
}

/* ── 6 · Blood Donation Center ─────────────────────────────────────────── */

function BloodContent() {
  const { t } = useLanguage();

  return (
    <>
      <PanelSection>
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={blood.logoSrc}
            alt={blood.logoAlt}
            className="h-14 w-14 rounded-2xl bg-white/5 object-contain p-1.5 ring-1 ring-white/10"
            loading="lazy"
          />
          <div className="min-w-0">
            <h3 className="text-base font-bold">{t(blood.title)}</h3>
            <p className="text-[11px] text-white/45">{t(blood.eyebrow)}</p>
          </div>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-white/55">{t(blood.subtitle)}</p>
      </PanelSection>

      <PanelSection>
        <StatGrid
          items={blood.stats.map((s) => ({
            value: s.literal ?? String(s.count ?? ""),
            label: t(s.label),
          }))}
        />
      </PanelSection>

      <PanelSection title={t(blood.roleBadge)}>
        <HoloCard className="border-brand-500/25 bg-brand-500/[0.06]">
          <p className="text-sm font-bold text-brand-300">{t(blood.roleTitle)}</p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-white/60">{t(blood.roleDesc)}</p>
        </HoloCard>
      </PanelSection>

      <PanelSection title={t(blood.servicesTitle)}>
        <div className="grid gap-2 sm:grid-cols-2">
          {blood.services.map((s, i) => (
            <div key={i} className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <span className="text-base">{s.icon}</span>
              <p className="mt-1 text-xs font-semibold">{t(s.title)}</p>
              <p className="mt-0.5 text-[10px] leading-relaxed text-white/45">{t(s.desc)}</p>
            </div>
          ))}
        </div>
      </PanelSection>

      <PanelSection>
        <HoloCard className="border-brand-500/25">
          <Droplet className="h-4 w-4 text-brand-400" />
          <p className="mt-2 text-[11px] italic leading-relaxed text-white/70">{t(blood.quote)}</p>
        </HoloCard>
      </PanelSection>

      <div className="space-y-2">
        <PanelLink href={shantichakraGroup} external accent="#ef4444">
          <span className="text-xs font-semibold">🩸 {t(blood.cta.join)}</span>
        </PanelLink>
        <PanelLink href={site.whatsapp} external accent="#ef4444">
          <span className="text-xs font-semibold">{t(blood.cta.donate)}</span>
        </PanelLink>
      </div>
    </>
  );
}

/* ── 7 · Achievement Gallery ───────────────────────────────────────────── */

function AchievementsContent() {
  const { t } = useLanguage();

  return (
    <>
      <PanelSection>
        <StatGrid
          items={achievements.stats.map((s) => ({
            value: `${s.value}${s.suffix ? "+" : ""}`,
            label: t(s.label),
          }))}
        />
      </PanelSection>

      <PanelSection title={t(achievements.featured.badge)}>
        <HoloCard className="border-gold-500/30 bg-gold-500/[0.06]">
          <div className="flex items-start justify-between gap-2">
            <Award className="h-5 w-5 shrink-0 text-gold-400" />
            <span className="text-[10px] text-white/40">{t(achievements.featured.date)}</span>
          </div>
          <h4 className="mt-2 text-sm font-bold">{t(achievements.featured.title)}</h4>
          <p className="mt-1.5 text-[11px] leading-relaxed text-white/60">
            {t(achievements.featured.desc)}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {achievements.featured.tags.map((tag, i) => (
              <span
                key={i}
                className="rounded-full bg-gold-500/15 px-2 py-0.5 text-[9px] font-bold text-gold-300"
              >
                {typeof tag === "string" ? tag : t(tag)}
              </span>
            ))}
          </div>
        </HoloCard>
      </PanelSection>

      <PanelSection title={t(achievements.title)}>
        <div className="space-y-2">
          {achievements.cards.map((c, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-3"
            >
              <span className="text-lg">{c.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold">{t(c.title)}</span>
                  <span className="shrink-0 text-[10px] text-white/35">{t(c.year)}</span>
                </div>
                <p className="mt-1 text-[10px] leading-relaxed text-white/50">{t(c.desc)}</p>
                {c.badge && (
                  <span className="mt-1.5 inline-block rounded-full bg-white/8 px-2 py-0.5 text-[9px] font-semibold text-white/60">
                    {typeof c.badge === "string" ? c.badge : t(c.badge)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </PanelSection>

      <p className="text-center text-[11px] italic text-white/40">{t(achievements.cta)}</p>
    </>
  );
}

/* ── 8 · Contact Center — the real form ────────────────────────────────── */

const socialIcons: Record<string, typeof Facebook> = {
  facebook: Facebook,
  tiktok: MessageCircle,
  youtube: Youtube,
  instagram: Instagram,
};

function ContactContent() {
  const { t, lang } = useLanguage();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error" | "unconfigured">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const endpoint = formspreeEndpoint();
    if (!endpoint) {
      setStatus("unconfigured");
      return;
    }
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        form.reset();
        setStatus("success");
      } else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  const methods = [
    { icon: Mail, label: { bn: "ইমেইল", en: "Email" }, value: site.email, href: `mailto:${site.email}` },
    { icon: MessageCircle, label: { bn: "হোয়াটসঅ্যাপ", en: "WhatsApp" }, value: site.phoneDisplay, href: site.whatsapp },
    { icon: Phone, label: { bn: "ফোন করুন", en: "Call" }, value: site.phoneDisplay, href: `tel:${site.phoneHref}` },
    { icon: MapPin, label: { bn: "অবস্থান", en: "Location" }, value: t(site.location), href: undefined },
  ];

  const inputClass =
    "mt-1 h-10 w-full rounded-xl border border-white/12 bg-black/30 px-3 text-xs text-white placeholder-white/25 outline-none transition focus:border-sky-400";

  return (
    <>
      <PanelSection title={t(contactContent.methodsTitle)}>
        <div className="space-y-2">
          {methods.map((m) => {
            const Icon = m.icon;
            const inner = (
              <>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/8">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] text-white/40">{t(m.label)}</span>
                  <span className="block truncate text-xs font-semibold">{m.value}</span>
                </span>
              </>
            );
            return m.href ? (
              <a
                key={m.label.en}
                href={m.href}
                target={m.href.startsWith("http") ? "_blank" : undefined}
                rel={m.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-2.5 transition hover:border-sky-400/35"
              >
                {inner}
              </a>
            ) : (
              <div
                key={m.label.en}
                className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-2.5"
              >
                {inner}
              </div>
            );
          })}
        </div>
      </PanelSection>

      <PanelSection title={t(contactContent.form.title)}>
        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wide text-white/40">
              {t(contactContent.form.fields.name.label)}
            </label>
            <input
              name="name"
              required
              minLength={2}
              placeholder={contactContent.form.fields.name.placeholder}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wide text-white/40">
              {t(contactContent.form.fields.email.label)}
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder={contactContent.form.fields.email.placeholder}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wide text-white/40">
              {t(contactContent.form.fields.phone.label)}
            </label>
            <input
              name="phone"
              type="tel"
              placeholder={contactContent.form.fields.phone.placeholder}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wide text-white/40">
              {t(contactContent.form.fields.subject.label)}
            </label>
            <select name="subject" required className={inputClass}>
              <option value="">{t(contactContent.form.subjectPlaceholder)}</option>
              {contactContent.form.subjects.map((s) => (
                <option key={s.value} value={s.value} className="bg-slate-900">
                  {lang === "bn" ? s.bn : s.en}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wide text-white/40">
              {t(contactContent.form.fields.message.label)}
            </label>
            <textarea
              name="message"
              required
              minLength={10}
              rows={4}
              placeholder={t(contactContent.form.fields.message.placeholder)}
              className="mt-1 w-full resize-none rounded-xl border border-white/12 bg-black/30 px-3 py-2.5 text-xs text-white placeholder-white/25 outline-none transition focus:border-sky-400"
            />
            <p className="mt-1 text-[10px] text-white/30">
              {t(contactContent.form.fields.message.helper)}
            </p>
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 text-xs font-bold text-slate-950 transition hover:from-sky-400 hover:to-cyan-300 disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {status === "sending"
              ? t(contactContent.form.status.sending)
              : t(contactContent.form.submit)}
          </button>

          {status === "success" && (
            <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-center text-[11px] text-emerald-300">
              {t(contactContent.form.status.success)}
            </p>
          )}
          {status === "error" && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-center text-[11px] text-red-300">
              {t(contactContent.form.status.error)}
            </p>
          )}
          {status === "unconfigured" && (
            <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-center text-[11px] text-amber-300">
              {t(contactContent.form.status.unconfigured)}
            </p>
          )}

          <p className="text-center text-[10px] text-white/30">{t(contactContent.form.privacy)}</p>
        </form>
      </PanelSection>

      <PanelSection title={t(contactContent.socialTitle)}>
        <div className="grid grid-cols-2 gap-2">
          {socials.map((s) => {
            const Icon = socialIcons[s.key] ?? Facebook;
            return (
              <a
                key={s.key}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] p-2.5 transition hover:border-sky-400/35"
              >
                <Icon className="h-4 w-4 shrink-0 text-white/60" />
                <span className="min-w-0">
                  <span className="block text-[11px] font-semibold">{s.name}</span>
                  <span className="block truncate text-[9px] text-white/35">{s.handle}</span>
                </span>
              </a>
            );
          })}
        </div>
      </PanelSection>

      <HoloCard className="border-sky-400/25 bg-sky-400/[0.05] text-center">
        <p className="text-xs font-semibold text-sky-300">{t(contactContent.response.title)}</p>
        <p className="mt-0.5 text-[10px] text-white/45">{t(contactContent.response.sub)}</p>
      </HoloCard>
    </>
  );
}

/* ── 9 · Client Mission Control ────────────────────────────────────────── */

function MissionControlContent({ data }: { data: VerseData }) {
  const { t } = useLanguage();

  return (
    <>
      <PanelSection>
        <HoloCard className="border-indigo-400/25 bg-indigo-400/[0.06]">
          <p className="flex items-center gap-2 text-xs font-bold text-indigo-300">
            <LayoutDashboard className="h-3.5 w-3.5" />
            {t({ en: "Your project, live", bn: "আপনার প্রজেক্ট, লাইভ" })}
          </p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-white/55">
            {t({
              en: "Clients track progress, approve milestones, download files, read invoices and message Rahat — all from the same portal used on the website.",
              bn: "ক্লায়েন্টরা অগ্রগতি দেখতে, মাইলস্টোন অনুমোদন করতে, ফাইল ডাউনলোড করতে, ইনভয়েস দেখতে ও বার্তা পাঠাতে পারেন — ওয়েবসাইটের একই পোর্টাল থেকে।",
            })}
          </p>
        </HoloCard>
      </PanelSection>

      <PanelSection title={t({ en: "Inside the portal", bn: "পোর্টালের ভেতরে" })}>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: "📊", en: "Project status", bn: "প্রজেক্ট স্ট্যাটাস" },
            { icon: "🧾", en: "Invoices", bn: "ইনভয়েস" },
            { icon: "📁", en: "File vault", bn: "ফাইল ভল্ট" },
            { icon: "💬", en: "Direct messages", bn: "সরাসরি বার্তা" },
            { icon: "🔁", en: "Revision requests", bn: "রিভিশন রিকোয়েস্ট" },
            { icon: "🔔", en: "Notifications", bn: "নোটিফিকেশন" },
          ].map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5 text-[11px]"
            >
              <span>{f.icon}</span>
              {t(f)}
            </div>
          ))}
        </div>
      </PanelSection>

      <div className="space-y-2">
        <PanelLink href="/dashboard" accent="#818cf8">
          <span className="flex items-center gap-2 text-xs font-semibold">
            <LayoutDashboard className="h-3.5 w-3.5" />
            {t({ en: "Open client dashboard", bn: "ক্লায়েন্ট ড্যাশবোর্ড খুলুন" })}
          </span>
        </PanelLink>
        <PanelLink href="/login" accent="#818cf8">
          <span className="flex items-center gap-2 text-xs font-semibold">
            <LogIn className="h-3.5 w-3.5" />
            {t({ en: "Client login", bn: "ক্লায়েন্ট লগইন" })}
          </span>
        </PanelLink>
      </div>

      {data.testimonials && data.testimonials.length > 0 && (
        <PanelSection title={t({ en: "What clients say", bn: "ক্লায়েন্টরা যা বলেন" })} className="mt-7">
          <div className="space-y-2">
            {data.testimonials.map((tm: any) => (
              <HoloCard key={tm.id}>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.max(0, Math.min(5, tm.rating ?? 5)) }).map((_, i) => (
                    <span key={i} className="text-[10px] text-gold-400">
                      ★
                    </span>
                  ))}
                </div>
                <p className="mt-1.5 text-[11px] italic leading-relaxed text-white/60">
                  “{tm.content}”
                </p>
                <p className="mt-1.5 text-[10px] font-semibold text-white/45">
                  — {tm.author_name}
                  {tm.author_title ? `, ${tm.author_title}` : ""}
                </p>
              </HoloCard>
            ))}
          </div>
        </PanelSection>
      )}
    </>
  );
}
