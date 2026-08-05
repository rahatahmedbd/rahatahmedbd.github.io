import type { Metadata, Viewport } from "next";
import fs from "node:fs";
import path from "node:path";
import "./globals.css";

// Structured data (Schema.org Person) — preserved verbatim from the original site.
const jsonLd = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "private/person-schema.json"), "utf8")
);

export const metadata: Metadata = {
  metadataBase: new URL("https://rahatahmedbd.github.io"),
  title:
    "Rahat Ahmed | রাহাত আহমেদ — Student, Teacher & Web Developer from Sunamganj",
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
  alternates: { canonical: "https://rahatahmedbd.github.io/" },
  openGraph: {
    type: "website",
    url: "https://rahatahmedbd.github.io/",
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
    description:
      "Student, Teacher, Blood Donor & Social Volunteer from Sunamganj, Bangladesh.",
    images: ["/assets/images/profile.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#7A0C2E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" data-theme="light">
      <body className="preload">
        {/* Fonts (faithful to original: Baloo Da 2 / Hind Siliguri / Inter) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@500;600;700;800&family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Favicon / manifest */}
        <link
          rel="icon"
          type="image/x-icon"
          href="/assets/images/favicon/favicon.ico"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/assets/images/favicon/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/assets/images/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="48x48"
          href="/assets/images/favicon/favicon-48x48.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/assets/images/favicon/apple-touch-icon.png"
        />
        <link rel="manifest" href="/assets/images/favicon/site.webmanifest" />

        {/* Original stylesheets (faithful port) */}
        <link rel="stylesheet" href="/css/main.css" />
        <link rel="stylesheet" href="/css/legacy-overrides.css" />

        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {children}
      </body>
    </html>
  );
}
