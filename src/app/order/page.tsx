import type { Metadata } from "next";

import WebsiteOrderExperience from "@/components/order/website-order-experience";
import { site } from "@/constants/site";

export const metadata: Metadata = {
  title: "Website Order — Build Your Website with Rahat Ahmed",
  description:
    "Order a premium, hand-built website from Rahat Ahmed. Choose a website type, pick a package, add extra features and submit your project in a guided step-by-step flow.",
  alternates: {
    canonical: `${site.url}order`,
  },
  openGraph: {
    title: "Website Order — Rahat Ahmed",
    description:
      "Guided step-by-step website ordering: choose a type, package and extras, then submit your project.",
    url: `${site.url}order`,
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
    title: "Website Order — Rahat Ahmed",
    description: "Order a premium website in a guided step-by-step flow.",
    images: ["/assets/images/profile.jpg"],
  },
};

export default WebsiteOrderExperience;
