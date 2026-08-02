"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navLinks, site } from "@/lib/site";
import { useLanguage } from "@/components/providers/language-provider";
import { useScrolled } from "@/hooks/use-scrolled";
import { useActiveSection } from "@/hooks/use-active-section";
import { LanguageToggle } from "./language-toggle";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { ExperienceSwitch } from "@/components/experience/experience-switch";
import { cn } from "@/lib/utils";

/** Mirrors the anchors rendered by the homepage. */
const sectionIds = ["home", "about", "services", "work", "trust", "contact"];

export function Navbar() {
  const { t } = useLanguage();
  const scrolled = useScrolled(12);
  const active = useActiveSection(sectionIds);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const onHome = pathname === "/";

  /** Anchors only resolve on the homepage — prefix them elsewhere. */
  const resolve = (href: string) =>
    href.startsWith("#") && !onHome ? `/${href}` : href;

  // Lock body scroll + close on Escape while the mobile drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "transition-all duration-500 ease-premium",
          scrolled
            ? "glass border-b border-border/10 shadow-soft"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-5 sm:px-6 lg:px-8">
          {/* Brand */}
          <a
            href="/"
            className="group flex items-center gap-3"
            aria-label={`${t(site.name)} — Home`}
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white shadow-soft transition-transform duration-300 group-hover:scale-105">
              {site.initials}
            </span>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="text-sm font-semibold tracking-tight">
                {t(site.name)}
              </span>
              <span className="text-[11px] text-fg-muted">{t(site.role)}</span>
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const isActive = onHome && active === link.href.replace("#", "");
              return (
                <li key={link.href}>
                  <a
                    href={resolve(link.href)}
                    className={cn(
                      "relative rounded-full px-3 py-2 text-sm font-medium transition-colors duration-300",
                      isActive
                        ? "text-fg"
                        : "text-fg-muted hover:text-fg"
                    )}
                  >
                    {t(link)}
                    {link.badge === "blood" && (
                      <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-brand-500 align-middle" />
                    )}
                    <span
                      className={cn(
                        "absolute inset-x-3 -bottom-0.5 h-px origin-left bg-brand-500 transition-transform duration-300",
                        isActive ? "scale-x-100" : "scale-x-0"
                      )}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <ExperienceSwitch to="verse" className="hidden xl:inline-flex" />
            <LanguageToggle />
            <ThemeToggle />
            <Button href="/order" size="sm" className="hidden sm:inline-flex">
              {t({ bn: "অর্ডার করুন", en: "Order a Website" })}
            </Button>

            {/* Mobile trigger */}
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/15 bg-surface/60 text-fg-soft transition-colors hover:text-fg lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          className={cn(
            "absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col gap-2 border-l border-border/10 bg-canvas p-6 pt-24 shadow-lift transition-transform duration-500 ease-premium",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={resolve(link.href)}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center justify-between rounded-2xl px-4 py-3 text-base font-medium transition-colors",
                onHome && active === link.href.replace("#", "")
                  ? "bg-brand-500/10 text-brand-600 dark:text-brand-400"
                  : "text-fg-soft hover:bg-canvas-muted hover:text-fg"
              )}
            >
              <span className="flex items-center gap-2">
                {t(link)}
                {link.badge === "blood" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                )}
              </span>
            </a>
          ))}
          <a
            href="/order"
            onClick={() => setOpen(false)}
            className="mt-3 inline-flex h-12 items-center justify-center rounded-full bg-brand-600 px-6 font-semibold text-white shadow-soft"
          >
            {t({ bn: "ওয়েবসাইট অর্ডার করুন", en: "Order a Website" })}
          </a>
          <div className="mt-1" onClick={() => setOpen(false)}>
            <ExperienceSwitch
              to="verse"
              className="h-11 w-full justify-center border-border/15 text-sm"
              label={t({ bn: "রাহাতভার্স (থ্রিডি) ঘুরে দেখুন", en: "Explore RahatVerse (3D)" })}
            />
          </div>
          <a
            href="/enter"
            onClick={() => setOpen(false)}
            className="inline-flex h-10 items-center justify-center rounded-full text-xs font-medium text-fg-muted transition-colors hover:text-fg"
          >
            {t({ bn: "অভিজ্ঞতা বদলান", en: "Change experience" })}
          </a>
        </div>
      </div>
    </header>
  );
}
