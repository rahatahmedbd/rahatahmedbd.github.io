"use client";

import { usePortfolioInteractions } from "@/hooks/use-portfolio-interactions";

/** Adds the original portfolio's behavior without duplicating legacy scripts. */
export function PortfolioInteractions() {
  usePortfolioInteractions();
  return null;
}
