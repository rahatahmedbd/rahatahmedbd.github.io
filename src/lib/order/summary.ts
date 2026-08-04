import { BUILDER_FEATURES } from "@/components/service-district/data";
import {
  estimateOrder,
  getCategory,
  getPackage,
  getPageTier,
  type OrderDraft,
} from "@/lib/order/pricing";
import { site } from "@/lib/site";

/** Human-readable list of the selected extras. */
export function featureNames(ids: string[], lang: "bn" | "en"): string[] {
  return ids
    .map((id) => BUILDER_FEATURES.find((f) => f.id === id))
    .filter((f): f is NonNullable<typeof f> => Boolean(f))
    .map((f) => (lang === "bn" ? f.nameBn : f.name));
}

/**
 * Plain-text order summary shared by the WhatsApp hand-off and the
 * "copy summary" action, so both always say exactly the same thing.
 */
export function buildOrderSummary(draft: OrderDraft, lang: "bn" | "en" = "en"): string {
  const estimate = estimateOrder(draft);
  const category = getCategory(draft.categoryId);
  const pkg = getPackage(draft.packageId);
  const pages = getPageTier(draft.pages);
  const extras = featureNames(draft.features, lang);

  const lines = [
    lang === "bn" ? "আসসালামু আলাইকুম রাহাত ভাই — আমি একটি ওয়েবসাইট অর্ডার করতে চাই।" : "Hello Rahat — I would like to order a website.",
    "",
    `• ${lang === "bn" ? "ধরন" : "Type"}: ${category.title[lang]}`,
    `• ${lang === "bn" ? "প্যাকেজ" : "Package"}: ${lang === "bn" ? pkg.titleBn : pkg.title}`,
    `• ${lang === "bn" ? "পেজ" : "Pages"}: ${pages.label[lang]}`,
    `• ${lang === "bn" ? "দুই ভাষা" : "Bilingual"}: ${draft.multilingual ? (lang === "bn" ? "হ্যাঁ" : "Yes") : lang === "bn" ? "না" : "No"}`,
    extras.length
      ? `• ${lang === "bn" ? "অতিরিক্ত" : "Extras"}: ${extras.join(", ")}`
      : `• ${lang === "bn" ? "অতিরিক্ত" : "Extras"}: —`,
    `• ${lang === "bn" ? "আনুমানিক মূল্য" : "Estimated price"}: ${estimate.priceRange}`,
    `• ${lang === "bn" ? "সময়" : "Timeline"}: ${estimate.timeline}`,
  ];

  if (draft.fullName.trim()) {
    lines.push("", `${lang === "bn" ? "নাম" : "Name"}: ${draft.fullName.trim()}`);
  }
  if (draft.companyName.trim()) {
    lines.push(`${lang === "bn" ? "প্রতিষ্ঠান" : "Company"}: ${draft.companyName.trim()}`);
  }
  if (draft.email.trim()) lines.push(`Email: ${draft.email.trim()}`);
  if (draft.phone.trim()) lines.push(`${lang === "bn" ? "ফোন" : "Phone"}: ${draft.phone.trim()}`);
  if (draft.notes.trim()) {
    lines.push("", `${lang === "bn" ? "নোট" : "Notes"}: ${draft.notes.trim()}`);
  }

  return lines.join("\n");
}

/** WhatsApp deep link carrying the full, pre-filled summary. */
export function whatsappOrderLink(draft: OrderDraft, lang: "bn" | "en" = "en"): string {
  const text = encodeURIComponent(buildOrderSummary(draft, lang));
  const base = site.whatsapp.replace(/\/$/, "");
  return `${base}?text=${text}`;
}
