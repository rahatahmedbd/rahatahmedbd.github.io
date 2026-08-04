"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { platformNavigation } from "@/data/platform";
import { usePlatform } from "@/state/platform-context";
import type { Experience } from "@/types/platform";

function getExperiencePath(experience: Experience): string {
  return experience === "rahatverse" ? "/rahatverse" : "/portfolio";
}

/** Shared chrome that remains mounted while users move between both experiences. */
export function PlatformNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentExperience, currentTheme, language, setExperience, setLanguage, setTheme } =
    usePlatform();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isRahatVerse = pathname?.startsWith("/rahatverse") ?? currentExperience === "rahatverse";
  const nextExperience: Experience = isRahatVerse ? "website" : "rahatverse";

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleExperienceSwitch = () => {
    setExperience(nextExperience);
    setIsOpen(false);
    router.push(getExperiencePath(nextExperience));
  };

  const handleWebsiteSection = (route: string) => {
    setExperience("website");
    setIsOpen(false);
    router.push(route);
  };

  return (
    <div ref={menuRef} className="fixed right-3 top-3 z-[100] text-sm">
      <div className="flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/95 p-1 text-[var(--color-text-primary)] shadow-lg backdrop-blur-xl">
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-controls="platform-navigation-menu"
          className="rounded-full px-3 py-2 font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)]"
        >
          {isRahatVerse ? "🏙️ Explore" : "🌐 Explore"}
        </button>
        <button
          type="button"
          onClick={handleExperienceSwitch}
          className="rounded-full bg-[var(--color-brand-primary)] px-3 py-2 font-medium text-white transition-colors hover:bg-[var(--color-brand-primary-dark)]"
        >
          {isRahatVerse ? "Website" : "RahatVerse"}
        </button>
      </div>

      {isOpen && (
        <div
          id="platform-navigation-menu"
          className="absolute right-0 mt-2 w-72 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/95 p-3 text-[var(--color-text-primary)] shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-2 pb-3">
            <div>
              <div className="font-semibold">One Rahat platform</div>
              <div className="text-xs text-[var(--color-text-tertiary)]">
                {currentExperience === "rahatverse" ? "RahatVerse" : "Website Experience"}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
              className="rounded-full px-2 py-1 text-xs hover:bg-[var(--color-surface-hover)]"
              aria-label={
                currentTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"
              }
            >
              {currentTheme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1 py-3">
            {platformNavigation.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => handleWebsiteSection(item.websiteRoute)}
                className="rounded-xl px-3 py-2 text-left text-xs text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-[var(--color-border)] pt-3">
            <button
              type="button"
              onClick={() => setLanguage(language === "bn" ? "en" : "bn")}
              className="rounded-xl px-3 py-2 text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
            >
              {language === "bn" ? "বাংলা" : "English"}
            </button>
            <button
              type="button"
              onClick={() => handleWebsiteSection("/order")}
              className="rounded-xl bg-[var(--color-brand-primary)] px-3 py-2 text-xs font-medium text-white hover:bg-[var(--color-brand-primary-dark)]"
            >
              Website Order →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
