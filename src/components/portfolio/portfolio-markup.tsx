import { PortfolioInteractions } from "@/components/portfolio/portfolio-interactions";
import { portfolioMarkup } from "@/content/portfolio-markup";

/**
 * Renders the preserved portfolio DOM while the application is incrementally
 * prepared for future section-level React migrations.
 */
export function PortfolioMarkup() {
  return (
    <>
      <div
        className="portfolio-content contents"
        dangerouslySetInnerHTML={{ __html: portfolioMarkup }}
      />
      <PortfolioInteractions />
    </>
  );
}
