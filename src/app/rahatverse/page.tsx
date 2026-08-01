import type { Metadata } from "next";
import { CityScene } from "@/components/verse/city-scene";

export const metadata: Metadata = {
  title: "RahatVerse — The Digital City",
  description:
    "RahatVerse Chapter 2: an explorable open-world digital city. Wander districts, discover reserved locations, meet citizens and find hidden secrets.",
};

export default function RahatVersePage() {
  return <CityScene />;
}
