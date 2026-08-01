"use client";

import { useState, useTransition } from "react";
import {
  Globe,
  CheckCircle,
  AlertCircle,
  Loader2,
  Share2,
  FileCode,
  Shield,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { saveSettingsAction } from "@/app/actions/cms";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

interface SeoManagerFormProps {
  initialSeo: any;
}

export function SeoManagerForm({ initialSeo }: SeoManagerFormProps) {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();

  const [metaTitle, setMetaTitle] = useState(initialSeo.metaTitle || "Rahat Ahmed | Web Developer & Science Student");
  const [metaDescription, setMetaDescription] = useState(initialSeo.metaDescription || "Official portfolio and community board of Rahat Ahmed.");
  const [metaKeywords, setMetaKeywords] = useState(initialSeo.metaKeywords || "Rahat Ahmed, Web Developer, Blood Donor, BNCC Cadet");
  const [ogImageUrl, setOgImageUrl] = useState(initialSeo.ogImageUrl || "");
  const [twitterCard, setTwitterCard] = useState(initialSeo.twitterCard || "summary_large_image");
  const [canonicalUrl, setCanonicalUrl] = useState(initialSeo.canonicalUrl || "https://rahatahmedbd.github.io");
  const [robotsTxt, setRobotsTxt] = useState(initialSeo.robotsTxt || "User-agent: *\nAllow: /\nSitemap: https://rahatahmedbd.github.io/sitemap.xml");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const payload = {
      metaTitle,
      metaDescription,
      metaKeywords,
      ogImageUrl,
      twitterCard,
      canonicalUrl,
      robotsTxt,
    };

    startTransition(async () => {
      const res = await saveSettingsAction("seo_settings", payload);

      if (!res.success) {
        setError(res.error || "Failed to save SEO parameters");
        return;
      }

      setSuccess("Search Engine Optimization (SEO) parameters saved successfully!");
    });
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Title Header */}
      <Reveal direction="fade">
        <div>
          <h1 className="text-display-sm font-bold tracking-tight">
            <span className="text-gradient">সার্চ ইঞ্জিন অপ্টিমাইজেশন (SEO Manager)</span>
          </h1>
          <p className="text-sm text-fg-soft mt-1">
            মেটা টাইটেল, মেটা ডেসক্রিপশন, ওপেন গ্রাফ সোশ্যাল ব্যানার, ক্যানোনিকাল লিংক এবং Robots.txt কন্টেন্ট কোন কোড এডিট ছাড়াই পরিবর্তন করুন।
          </p>
        </div>
      </Reveal>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4 text-sm text-brand-600 dark:text-brand-400">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <p>{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Column 1: Core Meta Tags */}
          <Reveal delay={60}>
            <div className="card-surface p-6 sm:p-8 rounded-3xl border border-border/10 bg-surface/30 backdrop-blur space-y-5 h-full">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-5 w-5 text-brand-500" />
                <h3 className="font-bold text-fg">মেটা হেডার ট্যাগস (Core Meta Tags)</h3>
              </div>

              {/* Meta Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="metaTitle">
                  Default Meta Title
                </label>
                <input
                  id="metaTitle"
                  type="text"
                  required
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors"
                />
              </div>

              {/* Meta Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="metaDescription">
                  Default Meta Description
                </label>
                <textarea
                  id="metaDescription"
                  rows={3}
                  required
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full p-4 rounded-3xl border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors resize-none"
                />
              </div>

              {/* Keywords */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="metaKeywords">
                  Meta Keywords (comma-separated)
                </label>
                <input
                  id="metaKeywords"
                  type="text"
                  required
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                  className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors"
                />
              </div>

              {/* Canonical URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="canonicalUrl">
                  Canonical URL Link
                </label>
                <input
                  id="canonicalUrl"
                  type="text"
                  required
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors"
                />
              </div>
            </div>
          </Reveal>

          {/* Column 2: Social OG & Robots */}
          <Reveal delay={120}>
            <div className="card-surface p-6 sm:p-8 rounded-3xl border border-border/10 bg-surface/30 backdrop-blur space-y-5 h-full">
              <div className="flex items-center gap-2 mb-2">
                <Share2 className="h-5 w-5 text-brand-500" />
                <h3 className="font-bold text-fg">সামাজিক শেয়ার এডিটর (Social & Directives)</h3>
              </div>

              {/* OG Image URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="ogImage">
                  Open Graph (OG) Image URL
                </label>
                <input
                  id="ogImage"
                  type="text"
                  value={ogImageUrl}
                  onChange={(e) => setOgImageUrl(e.target.value)}
                  placeholder="https://res.cloudinary.com/.../meta-og-image.jpg"
                  className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors"
                />
              </div>

              {/* Twitter Card Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="twitterCard">
                  Twitter Card Format Layout
                </label>
                <select
                  id="twitterCard"
                  value={twitterCard}
                  onChange={(e) => setTwitterCard(e.target.value)}
                  className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none text-fg"
                >
                  <option value="summary">Summary Card (small thumbnail)</option>
                  <option value="summary_large_image">Summary Card with Large Image</option>
                  <option value="app">App Download Card</option>
                </select>
              </div>

              {/* Robots.txt */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="robots">
                  Robots.txt Content
                </label>
                <textarea
                  id="robots"
                  rows={4}
                  required
                  value={robotsTxt}
                  onChange={(e) => setRobotsTxt(e.target.value)}
                  className="w-full p-4 rounded-3xl border border-border/10 bg-canvas/30 text-xs font-mono focus:border-brand-500 outline-none transition-colors resize-none"
                />
              </div>
            </div>
          </Reveal>
        </div>

        {/* Action Button */}
        <Reveal delay={180}>
          <div className="flex justify-end border-t border-border/10 pt-6">
            <Button type="submit" disabled={isPending} className="px-8 h-12 text-base font-semibold">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving SEO Parameters...
                </>
              ) : (
                "Save SEO Settings"
              )}
            </Button>
          </div>
        </Reveal>
      </form>
    </div>
  );
}
