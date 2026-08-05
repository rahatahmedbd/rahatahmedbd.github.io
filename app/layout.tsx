import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rahat Ahmed | রাহাত আহমেদ — Student, Teacher & Web Developer from Sunamganj",
  description: "Rahat Ahmed — HSC 2nd year student at Sunamganj Government College, home tutor, blood donor (A+), BNCC Cadet, and General Secretary of Shantichakra Blood Society Sunamganj. Founder of FS Coaching Center and Helping Hand Organization.",
  keywords: ["Rahat Ahmed", "রাহাত আহমেদ", "Sunamganj", "Shantichakra Blood Society", "BNCC Cadet", "FS Coaching Center", "Bangladesh Portfolio", "Student Portfolio", "Blood Donor", "Web Developer"],
  authors: [{ name: "Rahat Ahmed" }],
  creator: "Rahat Ahmed",
  publisher: "Rahat Ahmed",
  metadataBase: new URL("https://rahatahmedbd.github.io"),
  openGraph: {
    type: "website",
    locale: "bn_BD",
    alternateLocale: ["en_US"],
    url: "https://rahatahmedbd.github.io",
    siteName: "Rahat Ahmed Portfolio",
    title: "Rahat Ahmed | রাহাত আহমেদ — Portfolio",
    description: "Student, Teacher, Blood Donor, BNCC Cadet & General Secretary of Shantichakra Blood Society, Sunamganj, Bangladesh.",
    images: [
      {
        url: "/images/profile.jpg",
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
    images: ["/images/profile.jpg"],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" data-theme="light">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon/favicon-48x48.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <meta name="theme-color" content="#7A0C2E" />
        <meta name="color-scheme" content="light dark" />
        <meta name="msapplication-TileColor" content="#7A0C2E" />
        <meta name="googlebot" content="index, follow" />
        <meta name="language" content="Bengali, English" />
        <meta name="geo.region" content="BD-60" />
        <meta name="geo.placename" content="Sunamganj, Bangladesh" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}