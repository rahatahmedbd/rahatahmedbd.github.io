"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Sparkles } from "lucide-react";

interface AnnouncementBannerProps {
  settings: any;
}

export function AnnouncementBanner({ settings }: AnnouncementBannerProps) {
  const { t } = useLanguage();

  if (!settings || !settings.announcementActive) return null;

  const announcement = {
    en: settings.announcementTextEn || "Welcome to our new business platform!",
    bn: settings.announcementTextBn || "আমাদের নতুন ব্যবসায়িক প্ল্যাটফর্মে স্বাগতম!",
  };

  return (
    <div className="bg-gradient-to-r from-brand-600 to-indigo-600 text-white py-2.5 px-4 text-center text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-soft relative z-50">
      <Sparkles className="h-4 w-4 animate-pulse shrink-0 text-white" />
      <span>{t(announcement)}</span>
    </div>
  );
}
