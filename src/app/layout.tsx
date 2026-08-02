import type { Metadata, Viewport } from "next";
import { cookies, headers } from "next/headers";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LanguageProvider } from "@/components/providers/language-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { BackToTop } from "@/components/layout/back-to-top";
import { AnnouncementBanner } from "@/components/layout/announcement-banner";
import { GateMount } from "@/components/experience/gate-mount";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { EXPERIENCE_COOKIE, isExperienceMode } from "@/lib/experience/mode";
import { site } from "@/lib/site";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || site.url;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Rahat Ahmed | রাহাত আহমেদ — Student, Teacher & Web Developer from Sunamganj",
    template: "%s | Rahat Ahmed",
  },
  description:
    "Rahat Ahmed — HSC 2nd year student at Sunamganj Government College, home tutor, blood donor (A+), BNCC Cadet, and General Secretary of Shantichakra Blood Society Sunamganj. Founder of FS Coaching Center and Helping Hand Organization.",
  keywords: [
    "Rahat Ahmed",
    "রাহাত আহমেদ",
    "Sunamganj",
    "Shantichakra Blood Society",
    "BNCC Cadet",
    "FS Coaching Center",
    "Bangladesh Portfolio",
    "Student Portfolio",
    "Blood Donor",
    "Web Developer",
  ],
  authors: [{ name: "Rahat Ahmed" }],
  creator: "Rahat Ahmed",
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Rahat Ahmed | রাহাত আহমেদ — Portfolio",
    description:
      "Student, Teacher, Blood Donor, BNCC Cadet & General Secretary of Shantichakra Blood Society, Sunamganj, Bangladesh.",
    siteName: "Rahat Ahmed Portfolio",
    locale: "bn_BD",
    alternateLocale: ["en_US"],
    images: [
      {
        url: "/images/profile.jpg",
        width: 649,
        height: 866,
        alt: "Rahat Ahmed Portrait",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rahat Ahmed | রাহাত আহমেদ — Portfolio",
    description:
      "Student, Teacher, Blood Donor & Social Volunteer from Sunamganj, Bangladesh.",
    images: ["/images/profile.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  },
  manifest: "/favicon/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#07070a" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Rahat Ahmed",
  alternateName: "রাহাত আহমেদ",
  url: SITE_URL,
  image: `${SITE_URL}/images/profile.jpg`,
  birthDate: "2006-06-21",
  birthPlace: {
    "@type": "Place",
    name: "Jibdara, Shantiganj, Sunamganj, Bangladesh",
  },
  nationality: "Bangladeshi",
  gender: "Male",
  email: "mailto:rahatbd20505@gmail.com",
  telephone: "+8801626224878",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Sunamganj",
    addressCountry: "Bangladesh",
  },
  jobTitle: [
    "Student",
    "Home Tutor",
    "Web Developer",
    "Blood Donor",
    "General Secretary — Shantichakra Blood Society",
  ],
  knowsAbout: [
    "Web Development",
    "Teaching",
    "Blood Donation",
    "Community Service",
    "Content Creation",
  ],
  knowsLanguage: ["Bengali", "English"],
  sameAs: [
    "https://www.facebook.com/rahat.ahmed.948943",
    "https://www.tiktok.com/@rahatvives",
    "https://www.youtube.com/@RahatAhmedOfficial0",
    "https://www.instagram.com/rahatahm6d/",
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";
  
  const isDashboardOrAuth =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/unauthorized") ||
    pathname.startsWith("/init-super-admin") ||
    pathname.startsWith("/account") ||
    pathname.startsWith("/verse") ||
    pathname.startsWith("/rahatverse") ||
    pathname.startsWith("/enter");

  // The welcome gate is shown once, on the first public page a visitor lands
  // on. The decision happens on the server (cookie) so there is no flash of
  // the homepage before the gate appears — and no gate at all for returning
  // visitors, or anywhere inside the app shell.
  const experienceChoice = cookies().get(EXPERIENCE_COOKIE)?.value;
  const showGate = !isDashboardOrAuth && !isExperienceMode(experienceChoice);

  let currentSettings: any = {};
  try {
    const supabase = await getSupabaseServerClient();
    const { data: settingsData } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "general_settings")
      .maybeSingle();
    currentSettings = settingsData?.value || {};
  } catch {
    // ignore
  }

  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-canvas text-fg antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <ThemeProvider>
          <LanguageProvider>
            {!isDashboardOrAuth && <AnnouncementBanner settings={currentSettings} />}
            {!isDashboardOrAuth && <ScrollProgress />}
            {!isDashboardOrAuth && <Navbar />}
            <main id="main">{children}</main>
            {!isDashboardOrAuth && <Footer />}
            {!isDashboardOrAuth && <BackToTop />}
            {showGate && <GateMount />}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
