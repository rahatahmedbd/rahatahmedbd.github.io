import type { Metadata } from "next";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { MuseumScene } from "@/components/museum/museum-scene";

export const metadata: Metadata = {
  title: "Portfolio Museum | RahatVerse Chapter 5",
  description: "A fully interactive museum where every project becomes a living experience. Explore Rahat Ahmed's portfolio.",
};

export default async function MuseumPage() {
  const supabase = await getSupabaseServerClient();

  const [
    { data: projects },
    { data: categories },
    { data: testimonials }
  ] = await Promise.all([
    supabase.from("projects").select("*, categories(name)").order("sort_order", { ascending: true }),
    supabase.from("categories").select("*").order("sort_order", { ascending: true }),
    supabase.from("testimonials").select("*").eq("status", "approved")
  ]);

  return (
    <main className="w-full h-screen overflow-hidden bg-black text-white relative">
      <MuseumScene projects={projects || []} categories={categories || []} testimonials={testimonials || []} />
    </main>
  );
}
