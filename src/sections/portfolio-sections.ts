import type { PortfolioSectionId } from "@/types/portfolio";

/**
 * The existing single-page section order, retained as a typed contract for
 * future section-level migrations.
 */
export const portfolioSectionIds = [
  "home",
  "about",
  "education",
  "achievements",
  "experience",
  "blood",
  "tribute",
  "gallery",
  "contact",
] as const satisfies readonly PortfolioSectionId[];
