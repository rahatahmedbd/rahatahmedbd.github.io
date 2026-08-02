"use client";

import { useRouter } from "next/navigation";
import { Rocket, Building2 } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { writeExperienceMode, type ExperienceMode } from "@/lib/experience/mode";
import { cn } from "@/lib/utils";

/**
 * Jump between the two experiences without ever losing your place in the
 * product — the data, the order draft and the session all carry across.
 */
export function ExperienceSwitch({
  to,
  className,
  label,
  variant = "pill",
}: {
  to: ExperienceMode;
  className?: string;
  label?: string;
  variant?: "pill" | "ghost" | "solid";
}) {
  const { t } = useLanguage();
  const router = useRouter();

  const go = () => {
    writeExperienceMode(to);
    router.push(to === "verse" ? "/rahatverse" : "/");
  };

  const text =
    label ??
    (to === "verse"
      ? t({ en: "Enter RahatVerse", bn: "রাহাতভার্সে যান" })
      : t({ en: "Website view", bn: "ওয়েবসাইট ভিউ" }));

  return (
    <button
      type="button"
      onClick={go}
      className={cn(
        "inline-flex items-center gap-2 rounded-full text-xs font-semibold transition-all",
        variant === "pill" &&
          "h-9 border border-border/15 bg-surface/60 px-3.5 text-fg-soft hover:border-brand-500/40 hover:text-fg",
        variant === "ghost" && "text-fg-muted hover:text-fg",
        variant === "solid" &&
          "h-10 bg-brand-600 px-5 text-white shadow-soft hover:bg-brand-500",
        className
      )}
    >
      {to === "verse" ? <Rocket className="h-3.5 w-3.5" /> : <Building2 className="h-3.5 w-3.5" />}
      {text}
    </button>
  );
}
