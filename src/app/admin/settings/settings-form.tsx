"use client";

import { useState, useTransition } from "react";
import {
  Settings,
  Mail,
  Phone,
  MapPin,
  Share2,
  Globe,
  CheckCircle,
  AlertCircle,
  Loader2,
  Lock,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { saveSettingsAction } from "@/app/actions/cms";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

interface SettingsFormProps {
  currentSettings: any;
}

export function SettingsForm({ currentSettings }: SettingsFormProps) {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();

  // General site
  const [siteName, setSiteName] = useState(currentSettings.siteName || "Rahat Ahmed");
  const [logoUrl, setLogoUrl] = useState(currentSettings.logoUrl || "");
  const [faviconUrl, setFaviconUrl] = useState(currentSettings.faviconUrl || "");
  const [copyright, setCopyright] = useState(currentSettings.copyright || "© 2026 Rahat Ahmed. All rights reserved.");
  
  // Announcement
  const [announcementActive, setAnnouncementActive] = useState(currentSettings.announcementActive || false);
  const [announcementTextEn, setAnnouncementTextEn] = useState(currentSettings.announcementTextEn || "");
  const [announcementTextBn, setAnnouncementTextBn] = useState(currentSettings.announcementTextBn || "");

  // Contact
  const [email, setEmail] = useState(currentSettings.email || "rahatbd20505@gmail.com");
  const [phoneNumber, setPhoneNumber] = useState(currentSettings.phone || "+8801626224878");
  const [whatsapp, setWhatsapp] = useState(currentSettings.whatsapp || "+8801626224878");
  const [address, setAddress] = useState(currentSettings.address || "Sunamganj, Bangladesh");

  // Socials
  const [facebook, setFacebook] = useState(currentSettings.facebook || "https://facebook.com/rahat.ahmed.948943");
  const [tiktok, setTikTok] = useState(currentSettings.tiktok || "https://www.tiktok.com/@rahatvives");
  const [youtube, setYoutube] = useState(currentSettings.youtube || "https://www.youtube.com/@RahatAhmedOfficial0");
  const [instagram, setInstagram] = useState(currentSettings.instagram || "https://www.instagram.com/rahatahm6d/");

  // SEO
  const [seoTitle, setSeoTitle] = useState(currentSettings.seoTitle || "Rahat Ahmed | Web Developer & Student");
  const [seoDescription, setSeoDescription] = useState(currentSettings.seoDescription || "Premium web development portfolio of Rahat Ahmed.");
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState(currentSettings.googleAnalyticsId || "G-XXXXXXXXXX");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const payload = {
      siteName,
      logoUrl,
      faviconUrl,
      copyright,
      email,
      phone: phoneNumber,
      whatsapp,
      address,
      facebook,
      tiktok,
      youtube,
      instagram,
      seoTitle,
      seoDescription,
      googleAnalyticsId,
      announcementActive,
      announcementTextEn,
      announcementTextBn,
    };

    startTransition(async () => {
      const res = await saveSettingsAction("general_settings", payload);

      if (!res.success) {
        setError(res.error || "Failed to save settings");
        return;
      }

      setSuccess("Website settings updated successfully! Changes are now active live.");
    });
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Title Header */}
      <Reveal direction="fade">
        <div>
          <h1 className="text-display-sm font-bold tracking-tight">
            <span className="text-gradient">ওয়েবসাইট সেটিংস (Website Settings)</span>
          </h1>
          <p className="text-sm text-fg-soft mt-1">
            সাইটের নাম, লোগো, যোগাযোগের ঠিকানা, সোশ্যাল মিডিয়া লিংক এবং ডিফল্ট SEO মেটাডাটা এখান থেকে এডিট করুন।
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
          {/* Section 1: General Info */}
          <Reveal delay={60}>
            <div className="card-surface p-6 sm:p-8 rounded-3xl border border-border/10 bg-surface/30 backdrop-blur space-y-5 h-full">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-5 w-5 text-brand-500" />
                <h3 className="font-bold text-fg">জেনারেল সাইট সেটিংস (General)</h3>
              </div>

              {/* Site Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="siteName">
                  Website Name
                </label>
                <input
                  id="siteName"
                  type="text"
                  required
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors"
                />
              </div>

              {/* Logo URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="logoUrl">
                  Logo URL
                </label>
                <input
                  id="logoUrl"
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://res.cloudinary.com/.../logo.png"
                  className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors"
                />
              </div>

              {/* Favicon URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="faviconUrl">
                  Favicon URL
                </label>
                <input
                  id="faviconUrl"
                  type="text"
                  value={faviconUrl}
                  onChange={(e) => setFaviconUrl(e.target.value)}
                  placeholder="https://res.cloudinary.com/.../favicon.ico"
                  className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors"
                />
              </div>

              {/* Copyright */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="copyright">
                  Copyright Footer Text
                </label>
                <input
                  id="copyright"
                  type="text"
                  required
                  value={copyright}
                  onChange={(e) => setCopyright(e.target.value)}
                  className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors"
                />
              </div>

              {/* Announcement Banner */}
              <div className="border-t border-border/5 pt-4 space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-fg-muted">Announcement Banner</p>
                <div className="flex items-center gap-2.5 px-1">
                  <input
                    id="announcementActive"
                    type="checkbox"
                    checked={announcementActive}
                    onChange={(e) => setAnnouncementActive(e.target.checked)}
                    className="rounded border-border/20 text-brand-500 focus:ring-brand-500 h-4 w-4 bg-canvas/30"
                  />
                  <label htmlFor="announcementActive" className="text-xs text-fg-soft font-semibold cursor-pointer select-none">
                    Enable Banner Announcement (Top of website)
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="announcementEn">
                      Announcement English
                    </label>
                    <input
                      id="announcementEn"
                      type="text"
                      value={announcementTextEn}
                      onChange={(e) => setAnnouncementTextEn(e.target.value)}
                      placeholder="Welcome to our new platform!"
                      className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/30 text-xs focus:border-brand-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="announcementBn">
                      Announcement Bengali
                    </label>
                    <input
                      id="announcementBn"
                      type="text"
                      value={announcementTextBn}
                      onChange={(e) => setAnnouncementTextBn(e.target.value)}
                      placeholder="আমাদের নতুন প্ল্যাটফর্মে স্বাগতম!"
                      className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/30 text-xs focus:border-brand-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Section 2: Contact Info */}
          <Reveal delay={100}>
            <div className="card-surface p-6 sm:p-8 rounded-3xl border border-border/10 bg-surface/30 backdrop-blur space-y-5 h-full">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-5 w-5 text-brand-500" />
                <h3 className="font-bold text-fg">যোগাযোগের তথ্য (Contact Info)</h3>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="email">
                  Contact Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 pl-11 pr-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="phone">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted" />
                  <input
                    id="phone"
                    type="text"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full h-11 pl-11 pr-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* WhatsApp */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="whatsapp">
                  WhatsApp Link / Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted" />
                  <input
                    id="whatsapp"
                    type="text"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full h-11 pl-11 pr-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="address">
                  Address Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted" />
                  <input
                    id="address"
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full h-11 pl-11 pr-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </Reveal>

          {/* Section 3: Social Links */}
          <Reveal delay={140}>
            <div className="card-surface p-6 sm:p-8 rounded-3xl border border-border/10 bg-surface/30 backdrop-blur space-y-5 h-full">
              <div className="flex items-center gap-2 mb-2">
                <Share2 className="h-5 w-5 text-brand-500" />
                <h3 className="font-bold text-fg">সামাজিক লিংক সমূহ (Social Media)</h3>
              </div>

              {/* Facebook */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="facebook">
                  Facebook URL
                </label>
                <input
                  id="facebook"
                  type="text"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors"
                />
              </div>

              {/* TikTok */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="tiktok">
                  TikTok URL
                </label>
                <input
                  id="tiktok"
                  type="text"
                  value={tiktok}
                  onChange={(e) => setTikTok(e.target.value)}
                  className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors"
                />
              </div>

              {/* YouTube */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="youtube">
                  YouTube Channel URL
                </label>
                <input
                  id="youtube"
                  type="text"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors"
                />
              </div>

              {/* Instagram */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="instagram">
                  Instagram URL
                </label>
                <input
                  id="instagram"
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors"
                />
              </div>
            </div>
          </Reveal>

          {/* Section 4: SEO Metadata */}
          <Reveal delay={180}>
            <div className="card-surface p-6 sm:p-8 rounded-3xl border border-border/10 bg-surface/30 backdrop-blur space-y-5 h-full">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-5 w-5 text-brand-500" />
                <h3 className="font-bold text-fg">মেটাডাটা ও এসইও (SEO Settings)</h3>
              </div>

              {/* Default SEO Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="seoTitle">
                  Default Meta Title
                </label>
                <input
                  id="seoTitle"
                  type="text"
                  required
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors"
                />
              </div>

              {/* Default SEO Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="seoDescription">
                  Default Meta Description
                </label>
                <textarea
                  id="seoDescription"
                  rows={4}
                  required
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  className="w-full p-4 rounded-3xl border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors resize-none"
                />
              </div>

              {/* Google Analytics ID (Future prep) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="ga">
                  Google Analytics Measurement ID (Future Prep)
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted" />
                  <input
                    id="ga"
                    type="text"
                    disabled
                    value={googleAnalyticsId}
                    onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                    className="w-full h-11 pl-11 pr-4 rounded-full border border-border/10 bg-canvas/10 text-fg-muted text-sm outline-none cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Action Button */}
        <Reveal delay={220}>
          <div className="flex justify-end border-t border-border/10 pt-6">
            <Button type="submit" disabled={isPending} className="px-8 h-12 text-base font-semibold">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving Website Settings...
                </>
              ) : (
                "Save Website Settings"
              )}
            </Button>
          </div>
        </Reveal>
      </form>
    </div>
  );
}
