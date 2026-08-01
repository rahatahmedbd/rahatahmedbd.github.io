/** Supported interface languages. */
export type Lang = "bn" | "en";

/** A piece of text available in both languages. */
export interface Bilingual {
  bn: string;
  en: string;
}

export interface NavLink extends Bilingual {
  href: string;
  badge?: "blood";
}

export interface TimelineItem extends Bilingual {
  period: Bilingual;
  institution: Bilingual;
}

export interface Achievement {
  icon: string;
  year: Bilingual;
  title: Bilingual;
  desc: Bilingual;
  badge: string;
}

export interface Role extends Bilingual {
  icon: string;
  since: Bilingual;
  desc: Bilingual;
  status: Bilingual;
  tone: "default" | "blood";
}

export interface GalleryItem {
  src: string;
  alt: string;
  title: Bilingual;
  meta: Bilingual;
  badge: string;
  /** true when the image file is not yet committed (graceful placeholder). */
  missing?: boolean;
}

export * from "./database";
