import type { Metadata } from "next";

import { site } from "@/constants/site";
import ModernPortfolio from "./modern-portfolio";

export const metadata: Metadata = {
  title: "Portfolio — Rahat Ahmed | Student, Teacher & Web Developer",
  description:
    "Rahat Ahmed from Sunamganj, Bangladesh — HSC student at Sunamganj Government College, home tutor, blood donor, BNCC Cadet and General Secretary of Shantichakra Blood Society. Explore education, achievements, services, gallery and contact details.",
  alternates: {
    canonical: `${site.url}portfolio`,
  },
  openGraph: {
    title: "Rahat Ahmed — Portfolio",
    description:
      "Student, Teacher, Blood Donor, BNCC Cadet & Web Developer from Sunamganj, Bangladesh.",
    url: `${site.url}portfolio`,
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
    title: "Rahat Ahmed — Portfolio",
    description: "Student, Teacher, Blood Donor & Web Developer from Sunamganj, Bangladesh.",
    images: ["/assets/images/profile.jpg"],
  },
};

export default function PortfolioPage() {
  return <ModernPortfolio />;
}
