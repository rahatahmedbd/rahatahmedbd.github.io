import type { Metadata } from "next";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { MuseumScene } from "@/components/museum/museum-scene";

export const metadata: Metadata = {
  title: "Portfolio Museum | RahatVerse Chapter 5",
  description: "A fully interactive museum where every project becomes a living experience. Explore Rahat Ahmed's portfolio.",
};

export default async function MuseumPage() {
  // The museum must still render (empty) if Supabase is unreachable —
  // a data outage should never produce a 500 on a public page.
  let projects: any[] = [];
  let categories: any[] = [];
  let testimonials: any[] = [];

  try {
    const supabase = await getSupabaseServerClient();
    const [p, c, t] = await Promise.all([
      supabase
        .from("projects")
        .select("*, categories(name)")
        .order("sort_order", { ascending: true }),
      supabase.from("categories").select("*").order("sort_order", { ascending: true }),
      supabase.from("testimonials").select("*").eq("status", "approved"),
    ]);
    projects = p.data ?? [];
    categories = c.data ?? [];
    testimonials = t.data ?? [];
  } catch {
    // Render the empty museum shell.
  }

  /* 100dvh (not h-screen/100vh): on mobile browsers with chrome chrome bars,
     100vh is taller than the visible viewport and clips the museum's UI. */
  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-black text-white">
      <MuseumScene
        projects={projects}
        categories={categories}
        testimonials={testimonials}
      />
    </main>
  );
}
