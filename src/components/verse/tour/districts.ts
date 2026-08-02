/**
 * RahatVerse V2 — the city map.
 *
 * Every district is a *section of the same website*. Nothing here is new
 * information: it is the identical content, given an address.
 */

import type { Bilingual } from "@/types";

export type DistrictId =
  | "gate"
  | "headquarters"
  | "store"
  | "museum"
  | "service"
  | "lab"
  | "blood"
  | "achievements"
  | "contact"
  | "mission-control";

export interface District {
  id: DistrictId;
  /** Ordinal shown in the HUD ("Stop 3 of 9"). */
  stop: number;
  name: Bilingual;
  tagline: Bilingual;
  /** Which part of the website lives here. */
  mirrors: Bilingual;
  /** World position of the building. */
  x: number;
  z: number;
  /** Where the pod parks (slightly off the building, on the road). */
  parkX: number;
  parkZ: number;
  /** Building silhouette. */
  shape: "tower" | "dome" | "hall" | "lab" | "cross" | "gallery" | "beacon" | "pod";
  height: number;
  width: number;
  accent: number;
  accentCss: string;
  emoji: string;
  /** Anchor on the classic website — the same content, other door. */
  siteHref: string;
}

const ORBIT = 165;

/** Places nine districts evenly around the ring road, starting north. */
function ring(index: number, total = 9, radius = ORBIT) {
  const a = (index / total) * Math.PI * 2 - Math.PI / 2;
  return { x: Math.cos(a) * radius, z: Math.sin(a) * radius, angle: a };
}

function make(
  index: number,
  d: Omit<District, "x" | "z" | "parkX" | "parkZ" | "stop">
): District {
  const { x, z, angle } = ring(index);
  // Park the pod on the inner edge of the ring road, facing the building.
  const parkRadius = ORBIT - 34;
  return {
    ...d,
    stop: index + 1,
    x,
    z,
    parkX: Math.cos(angle) * parkRadius,
    parkZ: Math.sin(angle) * parkRadius,
  };
}

export const DISTRICTS: District[] = [
  make(0, {
    id: "headquarters",
    name: { en: "Agency Headquarters", bn: "এজেন্সি সদরদপ্তর" },
    tagline: { en: "The command centre of RahatVerse", bn: "রাহাতভার্সের কমান্ড সেন্টার" },
    mirrors: { en: "About · Mission · Vision · Education", bn: "পরিচয় · লক্ষ্য · দৃষ্টিভঙ্গি · শিক্ষা" },
    shape: "tower",
    height: 92,
    width: 26,
    accent: 0xf43f5e,
    accentCss: "#f43f5e",
    emoji: "🏢",
    siteHref: "/#about",
  }),
  make(1, {
    id: "store",
    name: { en: "Website Store", bn: "ওয়েবসাইট স্টোর" },
    tagline: { en: "Packages, pricing and ordering", bn: "প্যাকেজ, মূল্য ও অর্ডার" },
    mirrors: { en: "Website packages & the full order flow", bn: "ওয়েবসাইট প্যাকেজ ও সম্পূর্ণ অর্ডার সিস্টেম" },
    shape: "hall",
    height: 46,
    width: 44,
    accent: 0x22d3ee,
    accentCss: "#22d3ee",
    emoji: "🛍️",
    siteHref: "/order",
  }),
  make(2, {
    id: "museum",
    name: { en: "Portfolio Museum", bn: "পোর্টফোলিও জাদুঘর" },
    tagline: { en: "Every project on display", bn: "প্রতিটি প্রজেক্ট প্রদর্শনীতে" },
    mirrors: { en: "Portfolio · Projects · Experience · Gallery", bn: "পোর্টফোলিও · প্রজেক্ট · অভিজ্ঞতা · গ্যালারি" },
    shape: "dome",
    height: 40,
    width: 46,
    accent: 0xd4af37,
    accentCss: "#d4af37",
    emoji: "🏛️",
    siteHref: "/#work",
  }),
  make(3, {
    id: "service",
    name: { en: "Service Center", bn: "সার্ভিস সেন্টার" },
    tagline: { en: "What I build, teach and support", bn: "যা তৈরি করি, শেখাই ও সহায়তা দিই" },
    mirrors: { en: "Services offered", bn: "প্রদত্ত সেবাসমূহ" },
    shape: "cross",
    height: 52,
    width: 34,
    accent: 0xa3e635,
    accentCss: "#a3e635",
    emoji: "🛠️",
    siteHref: "/#services",
  }),
  make(4, {
    id: "lab",
    name: { en: "Innovation Lab", bn: "উদ্ভাবন গবেষণাগার" },
    tagline: { en: "Skills, stack and how I work", bn: "দক্ষতা, প্রযুক্তি ও কাজের ধরন" },
    mirrors: { en: "Skills · Tech stack · FAQs", bn: "দক্ষতা · প্রযুক্তি · প্রশ্নোত্তর" },
    shape: "lab",
    height: 58,
    width: 32,
    accent: 0xa78bfa,
    accentCss: "#a78bfa",
    emoji: "🧪",
    siteHref: "/#services",
  }),
  make(5, {
    id: "blood",
    name: { en: "Blood Donation Center", bn: "রক্তদান কেন্দ্র" },
    tagline: { en: "Shantichakra Blood Society", bn: "শান্তিচক্র ব্লাড সোসাইটি" },
    mirrors: { en: "Blood society & community work", bn: "ব্লাড সোসাইটি ও সমাজসেবা" },
    shape: "cross",
    height: 44,
    width: 36,
    accent: 0xef4444,
    accentCss: "#ef4444",
    emoji: "🩸",
    siteHref: "/#trust",
  }),
  make(6, {
    id: "achievements",
    name: { en: "Achievement Gallery", bn: "অর্জন গ্যালারি" },
    tagline: { en: "Awards, results and honours", bn: "পুরস্কার, ফলাফল ও সম্মাননা" },
    mirrors: { en: "Achievements & recognition", bn: "অর্জন ও স্বীকৃতি" },
    shape: "gallery",
    height: 38,
    width: 48,
    accent: 0xfbbf24,
    accentCss: "#fbbf24",
    emoji: "🏆",
    siteHref: "/#work",
  }),
  make(7, {
    id: "contact",
    name: { en: "Contact Center", bn: "যোগাযোগ কেন্দ্র" },
    tagline: { en: "Reach Rahat directly", bn: "সরাসরি রাহাতের সাথে যোগাযোগ" },
    mirrors: { en: "Contact details, form and socials", bn: "যোগাযোগের তথ্য, ফর্ম ও সোশ্যাল" },
    shape: "beacon",
    height: 66,
    width: 24,
    accent: 0x38bdf8,
    accentCss: "#38bdf8",
    emoji: "📡",
    siteHref: "/#contact",
  }),
  make(8, {
    id: "mission-control",
    name: { en: "Client Mission Control", bn: "ক্লায়েন্ট মিশন কন্ট্রোল" },
    tagline: { en: "Track your project", bn: "আপনার প্রজেক্ট ট্র্যাক করুন" },
    mirrors: { en: "Client portal · Login · Dashboard", bn: "ক্লায়েন্ট পোর্টাল · লগইন · ড্যাশবোর্ড" },
    shape: "pod",
    height: 50,
    width: 38,
    accent: 0x818cf8,
    accentCss: "#818cf8",
    emoji: "🛰️",
    siteHref: "/dashboard",
  }),
];

export const DISTRICT_BY_ID = Object.fromEntries(
  DISTRICTS.map((d) => [d.id, d])
) as Record<DistrictId, District>;

export const RING_RADIUS = ORBIT;
/** Radius the pod drives on. */
export const ROAD_RADIUS = ORBIT - 34;
