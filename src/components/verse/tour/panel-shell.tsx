"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ArrowUpRight, ExternalLink, X } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import type { District } from "./districts";
import { cn } from "@/lib/utils";

/**
 * The holographic panel that opens when the pod parks at a district.
 * Slides in from the right on desktop, up as a sheet on mobile.
 */
export function PanelShell({
  district,
  open,
  onClose,
  children,
  footer,
}: {
  district: District;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) scrollRef.current?.scrollTo({ top: 0 });
  }, [open, district.id]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-40 flex items-end justify-center sm:items-stretch sm:justify-end",
        !open && "invisible"
      )}
      aria-hidden={!open}
    >
      {/* Backdrop — tap outside the panel to close it (and never leak
          taps through to the 3D canvas behind). */}
      {open && (
        <button
          type="button"
          aria-label={t({ en: "Close panel", bn: "প্যানেল বন্ধ করুন" })}
          onClick={onClose}
          className="pointer-events-auto absolute inset-0 cursor-default bg-black/20 sm:bg-black/30"
        />
      )}
      <section
        role="dialog"
        aria-label={t(district.name)}
        className={cn(
          "pointer-events-auto relative flex w-full flex-col overflow-hidden border-white/10 bg-[#060b18]/95 text-white shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl transition-all duration-500 ease-premium",
          /* dvh: 82vh under mobile browser chrome can hide panel actions. */
          "max-h-[82dvh] rounded-t-[28px] border-t",
          "sm:max-h-none sm:h-full sm:max-w-[520px] sm:rounded-none sm:rounded-l-[28px] sm:border-l sm:border-t-0 sm:shadow-[-20px_0_60px_-20px_rgba(0,0,0,0.9)]",
          open
            ? "translate-y-0 opacity-100 sm:translate-x-0"
            : "translate-y-full opacity-0 sm:translate-y-0 sm:translate-x-full"
        )}
        style={{ ["--accent" as string]: district.accentCss }}
      >
        {/* Accent glow */}
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: `linear-gradient(to right, transparent, ${district.accentCss}, transparent)` }}
        />
        <span
          className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full blur-[100px] opacity-40"
          style={{ background: district.accentCss }}
        />

        {/* Header */}
        <header className="relative flex items-start gap-3 border-b border-white/8 px-5 py-4 sm:px-6 sm:py-5">
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-xl ring-1"
            style={{
              backgroundColor: `${district.accentCss}1f`,
              boxShadow: `inset 0 0 0 1px ${district.accentCss}44`,
            }}
          >
            {district.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <p
              className="text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: district.accentCss }}
            >
              {t({ en: `Stop ${district.stop} of 9`, bn: `${district.stop} নম্বর গন্তব্য / ৯` })}
            </p>
            <h2 className="mt-0.5 truncate text-lg font-bold tracking-tight sm:text-xl">
              {t(district.name)}
            </h2>
            <p className="mt-0.5 truncate text-[11px] text-white/45">{t(district.tagline)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t({ en: "Close panel", bn: "প্যানেল বন্ধ করুন" })}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/12 text-white/60 transition hover:border-white/30 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Mirrors-the-website note */}
        <div className="relative flex items-center justify-between gap-2 border-b border-white/8 bg-white/[0.02] px-5 py-2.5 text-[11px] sm:px-6">
          <span className="min-w-0 truncate text-white/45">{t(district.mirrors)}</span>
          <a
            href={district.siteHref}
            className="inline-flex shrink-0 items-center gap-1 font-semibold text-white/60 transition hover:text-white"
          >
            {t({ en: "Website view", bn: "ওয়েবসাইট ভিউ" })}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Body */}
        <div
          ref={scrollRef}
          className="relative flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6 sm:py-6"
        >
          {children}
        </div>

        {footer && (
          <footer className="relative border-t border-white/8 bg-black/30 px-5 py-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom))] sm:px-6">
            {footer}
          </footer>
        )}
      </section>
    </div>
  );
}

/* ── Reusable pieces for district content ─────────────────────────────── */

export function PanelSection({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mb-7 last:mb-0", className)}>
      {title && (
        <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
          {title}
        </h3>
      )}
      {children}
    </section>
  );
}

export function HoloCard({
  children,
  className,
  accent,
}: {
  children: ReactNode;
  className?: string;
  accent?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur",
        className
      )}
      style={accent ? { borderColor: `${accent}33` } : undefined}
    >
      {children}
    </div>
  );
}

export function StatGrid({
  items,
}: {
  items: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      {items.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-3 text-center"
        >
          <div className="text-lg font-extrabold tracking-tight">{s.value}</div>
          <div className="mt-0.5 text-[10px] leading-tight text-white/45">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

export function PanelLink({
  href,
  children,
  external,
  accent,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  accent?: string;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm transition hover:border-white/25 hover:bg-white/[0.06]"
      style={accent ? { boxShadow: `inset 2px 0 0 ${accent}` } : undefined}
    >
      <span className="min-w-0 flex-1">{children}</span>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-white/35 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
    </a>
  );
}
