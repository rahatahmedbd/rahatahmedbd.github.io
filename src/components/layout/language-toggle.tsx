"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

/** Segmented BN / EN language switch. */
export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border/15 bg-surface/60 p-0.5",
        className
      )}
      role="group"
      aria-label="Language selector"
    >
      {(["bn", "en"] as const).map((code) => {
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            className={cn(
              /* 36px+ tap height — comfortable on touch screens */
              "h-9 min-w-[2.5rem] rounded-full px-2.5 text-xs font-semibold transition-all duration-300",
              active
                ? "bg-brand-600 text-white shadow-soft"
                : "text-fg-muted hover:text-fg"
            )}
          >
            {code === "bn" ? "বাং" : "EN"}
          </button>
        );
      })}
    </div>
  );
}
