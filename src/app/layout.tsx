import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { site, siteKeywords } from "@/constants/site";
import { SiteShell } from "@/layouts/site-shell";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  keywords: [...siteKeywords],
  authors: [{ name: site.name }],
  alternates: {
    canonical: site.url,
  },
  openGraph: {
    type: "website",
    url: site.url,
    title: "Rahat Ahmed | রাহাত আহমেদ — Portfolio",
    description:
      "Student, Teacher, Blood Donor, BNCC Cadet & General Secretary of Shantichakra Blood Society, Sunamganj, Bangladesh.",
    siteName: "Rahat Ahmed Portfolio",
    locale: "bn_BD",
    alternateLocale: ["en_US"],
    images: [
      {
        url: "/assets/images/profile.jpg",
        width: 1200,
        height: 630,
        alt: "Rahat Ahmed Portrait",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rahat Ahmed | রাহাত আহমেদ — Portfolio",
    description: "Student, Teacher, Blood Donor & Social Volunteer from Sunamganj, Bangladesh.",
    images: ["/assets/images/profile.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  manifest: "/assets/images/favicon/site.webmanifest",
  icons: {
    icon: [
      { url: "/assets/images/favicon/favicon.ico", type: "image/x-icon" },
      { url: "/assets/images/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/assets/images/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/images/favicon/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [
      {
        url: "/assets/images/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#7A0C2E",
  colorScheme: "light dark",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Rahat Ahmed",
  alternateName: "রাহাত আহমেদ",
  url: site.url,
  image: `${site.url}assets/images/profile.jpg`,
  birthDate: "2006-06-21",
  birthPlace: {
    "@type": "Place",
    name: "Jibdara, Shantiganj, Sunamganj, Bangladesh",
  },
  nationality: "Bangladeshi",
  gender: "Male",
  email: site.email,
  telephone: site.telephone,
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
  worksFor: [
    {
      "@type": "EducationalOrganization",
      name: "Sunamganj Government College",
    },
    {
      "@type": "Organization",
      name: "Shantichakra Blood Society Sunamganj",
    },
    {
      "@type": "Organization",
      name: "FS Coaching Center",
    },
  ],
  alumniOf: [
    {
      "@type": "EducationalOrganization",
      name: "Satgaon Jibdara High School",
    },
    {
      "@type": "EducationalOrganization",
      name: "Jibdara Government Primary School",
    },
  ],
  sameAs: [
    "https://www.facebook.com/rahat.ahmed.948943",
    "https://www.tiktok.com/@rahatvives",
    "https://www.youtube.com/@RahatAhmedOfficial0",
    "https://www.instagram.com/rahatahm6d/",
  ],
  knowsAbout: [
    "Web Development",
    "Teaching",
    "Blood Donation",
    "Community Service",
    "Content Creation",
  ],
  knowsLanguage: ["Bengali", "English"],
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="bn" data-theme="light" suppressHydrationWarning>
      <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="language" content="Bengali, English" />
        <meta name="geo.region" content="BD-60" />
        <meta name="geo.placename" content="Sunamganj, Bangladesh" />
        <meta name="msapplication-TileColor" content="#7A0C2E" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        {/* Google-hosted fonts keep the existing rendering without adding a build-time network dependency. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@500;600;700;800&family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="preload">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
