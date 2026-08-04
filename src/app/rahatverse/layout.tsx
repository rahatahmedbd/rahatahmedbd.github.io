import type { Metadata } from "next";

import { site } from "@/constants/site";

export const metadata: Metadata = {
  title: "RahatVerse — 3D City Experience",
  description:
    "Explore Rahat Ahmed's portfolio inside an immersive 3D city. Tour districts for education, achievements, blood donation, skills and contact in an interactive WebGL experience.",
  alternates: {
    canonical: `${site.url}rahatverse`,
  },
  openGraph: {
    title: "RahatVerse — 3D City Experience",
    description: "Explore Rahat Ahmed's portfolio inside an immersive 3D city built with WebGL.",
    url: `${site.url}rahatverse`,
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
    title: "RahatVerse — 3D City Experience",
    description: "Explore Rahat Ahmed's portfolio inside an immersive 3D city.",
    images: ["/assets/images/profile.jpg"],
  },
};

export default function RahatVerseLayout({ children }: { children: React.ReactNode }) {
  return <div className="rahatverse">{children}</div>;
}
