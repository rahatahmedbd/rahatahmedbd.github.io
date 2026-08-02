import type { Metadata } from "next";
import { CityScene } from "@/components/verse/city-scene";

export const metadata: Metadata = {
  title: "RahatVerse — Free Roam City",
  description:
    "The original RahatVerse open-world city: wander the districts on foot, discover reserved locations, meet citizens and find hidden secrets.",
};

/**
 * The Chapter-2 free-roam city, kept exactly as it was. The guided tour at
 * /rahatverse is the default door; nothing that already existed was removed.
 */
export default function RahatVerseExplorePage() {
  return <CityScene />;
}
