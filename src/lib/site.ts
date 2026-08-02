import type { Bilingual, Lang, NavLink } from "@/types";

/** Central site configuration. Swappable for a CMS in a future phase. */
export const site = {
  name: { bn: "রাহাত আহমেদ", en: "Rahat Ahmed" } as Bilingual,
  role: { bn: "পোর্টফোলিও", en: "Portfolio" } as Bilingual,
  initials: "RA",
  url: "https://rahatahmedbd.github.io",
  email: "rahatbd20505@gmail.com",
  phoneDisplay: "+880 1626-224878",
  phoneHref: "+8801626224878",
  whatsapp: "https://wa.me/8801626224878",
  location: { bn: "সুনামগঞ্জ, বাংলাদেশ", en: "Sunamganj, Bangladesh" } as Bilingual,
  bloodGroup: "A+ Positive",
  bnccNumber: "25071152",
  birthDate: "2006-06-21",
  version: "Portfolio v3.0",
  defaultLang: "bn" as Lang,
} as const;

/**
 * Primary navigation. Deliberately short: the homepage is a single journey,
 * so nav points at sections, plus one route for the order flow.
 */
export const navLinks: NavLink[] = [
  { href: "#about", bn: "পরিচয়", en: "About" },
  { href: "#services", bn: "সেবা", en: "Services" },
  { href: "#work", bn: "কাজ", en: "Work" },
  { href: "#trust", bn: "বিশ্বাস", en: "Results" },
  { href: "#contact", bn: "যোগাযোগ", en: "Contact" },
];

/** Secondary destinations surfaced in the footer, not the main nav. */
export const secondaryLinks: NavLink[] = [
  { href: "/order", bn: "ওয়েবসাইট অর্ডার", en: "Order a Website" },
  { href: "/rahatverse", bn: "রাহাতভার্স", en: "Explore RahatVerse" },
  { href: "/museum", bn: "পোর্টফোলিও মিউজিয়াম", en: "Portfolio Museum" },
  { href: "/login", bn: "ক্লায়েন্ট লগইন", en: "Client Login" },
];

export const socials = [
  {
    key: "facebook",
    name: "Facebook",
    handle: "Rahat Ahmed",
    href: "https://www.facebook.com/rahat.ahmed.948943",
  },
  {
    key: "tiktok",
    name: "TikTok",
    handle: "@rahatvives",
    href: "https://www.tiktok.com/@rahatvives",
  },
  {
    key: "youtube",
    name: "YouTube",
    handle: "@RahatAhmedOfficial0",
    href: "https://www.youtube.com/@RahatAhmedOfficial0",
  },
  {
    key: "instagram",
    name: "Instagram",
    handle: "@rahatahm6d",
    href: "https://www.instagram.com/rahatahm6d/",
  },
] as const;

export const shantichakraGroup = "https://www.facebook.com/share/g/192g4S4brD/";
export const helpingHandPost = "https://www.facebook.com/share/p/1JDAkxehvJ/";

/** Formspree endpoint built from the public env var (Phase 1 contact form). */
export function formspreeEndpoint(): string | null {
  const id = process.env.NEXT_PUBLIC_FORMSPREE_ID;
  if (!id || id === "YOUR_FORM_ID") return null;
  return `https://formspree.io/f/${id}`;
}
