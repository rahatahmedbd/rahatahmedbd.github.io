import type { Metadata } from "next";
import { CityTour } from "@/components/verse/tour/city-tour";
import { emptyVerseData, type VerseData } from "@/components/verse/tour/types";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "RahatVerse — Guided City Tour",
  description:
    "Board a self-driving pod and tour RahatVerse: the agency headquarters, website store, portfolio museum, service centre, innovation lab, blood donation centre, achievement gallery, contact centre and client mission control — the same information as the website, in a 3D city.",
};

/**
 * RahatVerse is not a separate product: it reads the *same* Supabase tables
 * the classic website reads, so both doors always show identical content.
 * If the database is unreachable the city still opens with its static
 * (bilingual, file-based) content, exactly like the website does.
 */
export default async function RahatVersePage() {
  let data: VerseData = emptyVerseData;

  try {
    const supabase = await getSupabaseServerClient();
    const [projects, services, skills, faqs, testimonials] = await Promise.all([
      supabase
        .from("projects")
        .select("*, categories(name)")
        .order("sort_order", { ascending: true }),
      supabase
        .from("services")
        .select("*")
        .eq("is_enabled", true)
        .order("sort_order", { ascending: true }),
      supabase.from("skills").select("*").order("sort_order", { ascending: true }),
      supabase
        .from("faqs")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true }),
      supabase.from("testimonials").select("*").eq("status", "approved"),
    ]);

    data = {
      projects: projects.data ?? [],
      services: services.data ?? [],
      skills: skills.data ?? [],
      faqs: faqs.data ?? [],
      testimonials: testimonials.data ?? [],
    };
  } catch {
    // Keep the city open on a data outage.
  }

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-black text-white">
      <CityTour data={data} />
    </main>
  );
}
