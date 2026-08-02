/**
 * Ordering business logic — one implementation, used by every experience.
 *
 * The Website Experience (/order) and RahatVerse (Website Store district) both
 * call these helpers, so a visitor sees the exact same estimate, timeline and
 * scope no matter which door they walked through.
 */

import {
  BUILDER_FEATURES,
  BUILDINGS_DATA,
  PORTAL_PACKAGES,
  type BuildingData,
  type PortalPackage,
} from "@/components/service-district/data";
import type { Bilingual } from "@/types";

export type PackageId = PortalPackage["id"];

export interface PageTier {
  id: string;
  label: Bilingual;
  cost: number;
}

/** Page-count tiers — identical values to the classic 3D Visual Builder. */
export const PAGE_TIERS: PageTier[] = [
  { id: "1 Page", label: { en: "1 page", bn: "১ পেজ" }, cost: 0 },
  { id: "2-5 Pages", label: { en: "2–5 pages", bn: "২–৫ পেজ" }, cost: 30 },
  { id: "6-10 Pages", label: { en: "6–10 pages", bn: "৬–১০ পেজ" }, cost: 50 },
  { id: "11-20 Pages", label: { en: "11–20 pages", bn: "১১–২০ পেজ" }, cost: 80 },
  { id: "20+ Pages", label: { en: "20+ pages", bn: "২০+ পেজ" }, cost: 120 },
];

export const MULTILINGUAL_COST = 40;

export interface OrderDraft {
  categoryId: string;
  packageId: PackageId;
  pages: string;
  multilingual: boolean;
  features: string[];
  /** Contact block — only what is genuinely required. */
  fullName: string;
  phone: string;
  email: string;
  companyName: string;
  country: string;
  notes: string;
}

export const emptyOrderDraft: OrderDraft = {
  categoryId: BUILDINGS_DATA[0].id,
  packageId: "professional",
  pages: "2-5 Pages",
  multilingual: false,
  features: ["admin-panel", "seo-package"],
  fullName: "",
  phone: "",
  email: "",
  companyName: "",
  country: "Bangladesh",
  notes: "",
};

export function getCategory(id: string): BuildingData {
  return BUILDINGS_DATA.find((b) => b.id === id) ?? BUILDINGS_DATA[0];
}

export function getPackage(id: PackageId): PortalPackage {
  return PORTAL_PACKAGES.find((p) => p.id === id) ?? PORTAL_PACKAGES[1];
}

export function getPageTier(id: string): PageTier {
  return PAGE_TIERS.find((p) => p.id === id) ?? PAGE_TIERS[1];
}

export interface OrderEstimate {
  base: number;
  featuresCost: number;
  pagesCost: number;
  languageCost: number;
  total: number;
  priceMin: number;
  priceMax: number;
  priceRange: string;
  timeline: string;
  scope: string;
  level: string;
}

/**
 * Same maths as the classic builder (base + features + pages + language),
 * with the chosen package acting as a floor so a package upgrade always
 * reflects in the estimate.
 */
export function estimateOrder(draft: OrderDraft): OrderEstimate {
  const category = getCategory(draft.categoryId);
  const pkg = getPackage(draft.packageId);

  const base = category.basePrice;
  const featuresCost = draft.features.reduce((acc, id) => {
    const f = BUILDER_FEATURES.find((item) => item.id === id);
    return acc + (f ? f.cost : 0);
  }, 0);
  const pagesCost = getPageTier(draft.pages).cost;
  const languageCost = draft.multilingual ? MULTILINGUAL_COST : 0;

  const raw = base + featuresCost + pagesCost + languageCost;
  const total = Math.max(raw, pkg.priceValue);

  const priceMin = Math.round(total * 0.9);
  const priceMax = Math.round(total * 1.25);

  const timeline =
    draft.features.length > 7 || draft.pages.includes("20")
      ? "3–4 Weeks"
      : draft.features.length > 4 || draft.pages.includes("11")
      ? "2–3 Weeks"
      : draft.features.length > 2
      ? "1–2 Weeks"
      : "3–7 Days";

  const scope =
    total > 800
      ? "Enterprise Cloud Platform"
      : total > 450
      ? "Advanced Custom App"
      : total > 250
      ? "Standard Business Suite"
      : "Essential Micro Portal";

  const level =
    total > 800
      ? "Level 5 — Unlimited Scale"
      : total > 450
      ? "Level 4 — High Capacity"
      : total > 250
      ? "Level 2 — Interactive Portal"
      : "Level 1 — Lightweight & Fast";

  return {
    base,
    featuresCost,
    pagesCost,
    languageCost,
    total,
    priceMin,
    priceMax,
    priceRange: `$${priceMin} – $${priceMax}`,
    timeline,
    scope,
    level,
  };
}

/* ── Draft persistence ────────────────────────────────────────────────────
   A draft started in RahatVerse can be finished on the website (and back),
   because both experiences read and write the same key.                    */

const DRAFT_KEY = "rv-order-draft";

export function loadOrderDraft(): OrderDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<OrderDraft>;
    return { ...emptyOrderDraft, ...parsed };
  } catch {
    return null;
  }
}

export function saveOrderDraft(draft: OrderDraft) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* storage disabled — the flow still works, it just will not resume */
  }
}

export function clearOrderDraft() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
