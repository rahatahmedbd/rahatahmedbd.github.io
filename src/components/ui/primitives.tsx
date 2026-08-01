import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

export { Reveal };

/* ── Container ───────────────────────────────────────────────────────────── */
export function Container({
  children,
  className,
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-6 lg:px-8",
        size === "narrow" && "max-w-3xl",
        size === "default" && "max-w-6xl",
        size === "wide" && "max-w-7xl",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ── Section ─────────────────────────────────────────────────────────────── */
export function Section({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-24 py-20 sm:py-28", className)}
    >
      {children}
    </section>
  );
}

/* ── Eyebrow ─────────────────────────────────────────────────────────────── */
export function Eyebrow({
  children,
  className,
  tone = "brand",
}: {
  children: ReactNode;
  className?: string;
  tone?: "brand" | "gold" | "light";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]",
        tone === "brand" &&
          "border-brand-500/25 bg-brand-500/10 text-brand-500 dark:text-brand-400",
        tone === "gold" &&
          "border-gold-500/30 bg-gold-500/10 text-gold-600 dark:text-gold-400",
        tone === "light" &&
          "border-white/20 bg-white/10 text-white",
        className
      )}
    >
      {children}
    </span>
  );
}

/* ── Section heading (eyebrow + title + subtitle) ────────────────────────── */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "brand",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
  tone?: "brand" | "gold" | "light";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow ? (
        <Reveal>
          <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        </Reveal>
      ) : null}
      <Reveal delay={80}>
        <h2 className="max-w-3xl text-balance text-display-lg font-bold tracking-tight">
          {title}
        </h2>
      </Reveal>
      {subtitle ? (
        <Reveal delay={140}>
          <p
            className={cn(
              "max-w-2xl text-pretty text-base leading-relaxed text-fg-soft sm:text-lg",
              align === "center" && "mx-auto"
            )}
          >
            {subtitle}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

/* ── Card ────────────────────────────────────────────────────────────────── */
export function Card({
  children,
  className,
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "card-surface rounded-3xl",
        interactive &&
          "transition-all duration-500 ease-premium hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-lift",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ── Chip ────────────────────────────────────────────────────────────────── */
export function Chip({
  children,
  className,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "brand" | "outline" | "light";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium sm:text-sm",
        tone === "default" &&
          "border border-border/10 bg-canvas-muted text-fg-soft",
        tone === "brand" && "border border-brand-500/30 bg-brand-500/10 text-brand-600 dark:text-brand-400",
        tone === "outline" && "border border-border/20 text-fg-soft",
        tone === "light" && "border border-white/20 bg-white/10 text-white",
        className
      )}
    >
      {children}
    </span>
  );
}

/* ── Badge ───────────────────────────────────────────────────────────────── */
export function Badge({
  children,
  className,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "brand" | "success" | "gold" | "light";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        tone === "default" && "bg-canvas-muted text-fg-soft ring-1 ring-inset ring-border/10",
        tone === "brand" && "bg-brand-500/12 text-brand-600 ring-1 ring-inset ring-brand-500/25 dark:text-brand-400",
        tone === "success" && "bg-emerald-500/12 text-emerald-600 ring-1 ring-inset ring-emerald-500/25 dark:text-emerald-400",
        tone === "gold" && "bg-gold-500/15 text-gold-600 ring-1 ring-inset ring-gold-500/30 dark:text-gold-400",
        tone === "light" && "bg-white/15 text-white ring-1 ring-inset ring-white/25",
        className
      )}
    >
      {children}
    </span>
  );
}
