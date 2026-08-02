import type { Metadata } from "next";
import { FactoryScene } from "@/components/verse/factory/factory-scene";

export const metadata: Metadata = {
  title: "Website Factory — RahatVerse Chapter 6",
  description:
    "Step inside the Website Factory — the signature experience of RahatVerse. Explore the complete interactive 3D production pipeline where every website is built.",
};

export default function WebsiteFactoryPage() {
  return <FactoryScene />;
}
