import type { Metadata } from "next";
import { EntryGate } from "@/components/experience/entry-gate";

export const metadata: Metadata = {
  title: "Choose your experience | RahatVerse V2",
  description:
    "Two doors, one story. Explore Rahat Ahmed's world as a fast premium website, or as a 3D cinematic guided city tour — same information, same ordering system.",
  robots: { index: false, follow: true },
};

/** Standalone welcome screen — also used by the “switch experience” buttons. */
export default function EnterPage() {
  return <EntryGate defaultOpen standalone />;
}
