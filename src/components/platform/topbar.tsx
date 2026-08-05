"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sun, Moon, Globe, MoreHorizontal, ArrowRight, 
  User, Award, Briefcase, Phone 
} from "lucide-react";

import { usePlatform } from "@/state/platform-context";
import type { Experience } from "@/types/platform";
import type { PortfolioLanguage, PortfolioTheme } from "@/types/portfolio";

interface TopbarProps {
  className?: string;
}

const BRAND = {
  short: "RA",
  name: "Rahat Ahmed",
  tagline: "Portfolio",
};

const QUICK_LINKS = [
  { label: "About", href: "/portfolio#about", icon: User },
  { label: "Achievements", href: "/portfolio#achievements", icon: Award },
  { label: "Services", href: "/portfolio#services", icon: Briefcase },
  { label: "Contact", href: "/portfolio#contact", icon: Phone },
];

export function PremiumTopbar({ className = "" }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    currentExperience, 
    currentTheme, 
    language, 
    setExperience, 
    setTheme, 
    setLanguage 
  } = usePlatform();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isRahatVerse = pathname?.startsWith("/rahatverse") || currentExperience === "rahatverse";
  const activeExperience: Experience = isRahatVerse ? "rahatverse" : "website";

  // Scroll state for subtle visual change
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on outside click / escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const switchExperience = (target: Experience) => {
    setExperience(target);
    setMenuOpen(false);
    const targetPath = target === "rahatverse" ? "/rahatverse" : "/portfolio";
    router.push(targetPath);
  };

  const handleThemeToggle = () => {
    const next: PortfolioTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(next);
    setMenuOpen(false);
  };

  const handleLanguageToggle = () => {
    const next: PortfolioLanguage = language === "bn" ? "en" : "bn";
    setLanguage(next);
    setMenuOpen(false);
  };

  const navigateTo = (href: string) => {
    setMenuOpen(false);
    router.push(href);
  };

  const isWelcome = pathname === "/";

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-[120] transition-all duration-300 ${
        isScrolled 
          ? "border-b border-white/10 bg-[#07070d]/95 backdrop-blur-2xl shadow-[0_1px_0_0_rgba(255,255,255,0.04)]" 
          : "bg-[#07070d]/70 backdrop-blur-xl"
      } ${className}`}
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex h-16 items-center justify-between md:h-[72px]">
          
          {/* LEFT — Brand */}
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="group flex items-center gap-3 transition-opacity hover:opacity-90"
              aria-label="Go to welcome"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#07070d] font-semibold text-[17px] tracking-[-0.5px] shadow-sm ring-1 ring-white/20 transition-all group-hover:scale-[1.02]">
                {BRAND.short}
              </div>
              <div className="hidden sm:block">
                <div className="font-semibold text-[15px] leading-none tracking-[-0.2px] text-white">
                  {BRAND.name}
                </div>
                <div className="text-[10px] leading-none text-white/50 mt-px tracking-[0.5px]">
                  {BRAND.tagline}
                </div>
              </div>
            </Link>
          </div>

          {/* CENTER — Experience Switcher (desktop) */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center rounded-full border border-white/10 bg-white/[0.035] p-1 backdrop-blur">
              <button
                onClick={() => switchExperience("website")}
                className={`flex items-center gap-2 rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-200 ${
                  activeExperience === "website"
                    ? "bg-white text-[#07070d] shadow-sm"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
                aria-current={activeExperience === "website" ? "page" : undefined}
              >
                <span>Website</span>
              </button>
              <button
                onClick={() => switchExperience("rahatverse")}
                className={`flex items-center gap-2 rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-200 ${
                  activeExperience === "rahatverse"
                    ? "bg-white text-[#07070d] shadow-sm"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
                aria-current={activeExperience === "rahatverse" ? "page" : undefined}
              >
                <span>RahatVerse</span>
              </button>
            </div>
          </div>

          {/* RIGHT — Controls */}
          <div className="flex items-center gap-2">
            
            {/* Mobile Experience Switcher (compact) */}
            <div className="md:hidden flex items-center rounded-full border border-white/10 bg-white/[0.035] p-0.5 text-xs">
              <button
                onClick={() => switchExperience("website")}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  activeExperience === "website" 
                    ? "bg-white text-[#07070d]" 
                    : "text-white/70"
                }`}
              >
                Web
              </button>
              <button
                onClick={() => switchExperience("rahatverse")}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  activeExperience === "rahatverse" 
                    ? "bg-white text-[#07070d]" 
                    : "text-white/70"
                }`}
              >
                Verse
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              aria-label={currentTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] text-white/80 transition-all hover:bg-white/10 hover:text-white active:scale-[0.96]"
            >
              {currentTheme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* Language Switcher */}
            <button
              onClick={handleLanguageToggle}
              aria-label={`Switch to ${language === "bn" ? "English" : "Bangla"}`}
              className="hidden sm:flex h-9 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.035] px-3 text-xs font-medium text-white/80 transition-all hover:bg-white/10 hover:text-white active:scale-[0.96]"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Three-dot Menu Trigger */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-expanded={menuOpen}
                aria-label="Open navigation menu"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] text-white/80 transition-all hover:bg-white/10 hover:text-white active:scale-[0.96]"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 mt-2 w-72 rounded-2xl border border-white/10 bg-[#0a0c12]/95 backdrop-blur-2xl shadow-2xl p-2 text-sm z-[200]"
                  >
                    {/* Experience quick switch (mobile friendly) */}
                    <div className="md:hidden px-1 pb-2 pt-1">
                      <div className="text-[10px] uppercase tracking-[1px] text-white/40 px-3 pb-1">Experience</div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => switchExperience("website")}
                          className={`flex-1 rounded-xl px-4 py-2 text-left text-sm font-medium transition ${activeExperience === "website" ? "bg-white text-[#07070d]" : "hover:bg-white/10"}`}
                        >
                          Website
                        </button>
                        <button
                          onClick={() => switchExperience("rahatverse")}
                          className={`flex-1 rounded-xl px-4 py-2 text-left text-sm font-medium transition ${activeExperience === "rahatverse" ? "bg-white text-[#07070d]" : "hover:bg-white/10"}`}
                        >
                          RahatVerse
                        </button>
                      </div>
                    </div>

                    {/* Quick Links */}
                    <div className="py-1">
                      {QUICK_LINKS.map((link) => {
                        const Icon = link.icon;
                        return (
                          <button
                            key={link.label}
                            onClick={() => navigateTo(link.href)}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-white/85 transition hover:bg-white/5 hover:text-white"
                          >
                            <Icon className="h-4 w-4 text-white/60" />
                            <span>{link.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="my-1 h-px bg-white/10" />

                    {/* Secondary actions */}
                    <button
                      onClick={() => navigateTo("/order")}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-white/85 hover:bg-white/5 hover:text-white"
                    >
                      <span>Order a Website</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => navigateTo("/dashboard")}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-white/85 hover:bg-white/5 hover:text-white"
                    >
                      Client Portal
                    </button>

                    <button
                      onClick={() => navigateTo("/admin")}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-white/85 hover:bg-white/5 hover:text-white"
                    >
                      Admin
                    </button>

                    {/* Mobile language */}
                    <div className="sm:hidden border-t border-white/10 mt-1 pt-1">
                      <button
                        onClick={handleLanguageToggle}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-white/85 hover:bg-white/5 hover:text-white"
                      >
                        <Globe className="h-4 w-4 text-white/60" />
                        <span>Language: {language === "bn" ? "বাংলা" : "English"}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle bottom line on welcome for separation */}
      {isWelcome && (
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      )}
    </nav>
  );
}
