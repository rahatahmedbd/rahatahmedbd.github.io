import { getSupabaseServerClient } from "@/lib/supabase/server";
import { TestimonialsManager } from "./testimonials-manager";

export const metadata = {
  title: "Testimonials Manager | Super Admin",
};

export default async function AdminTestimonialsPage() {
  const supabase = await getSupabaseServerClient();
  const { data: testimonials, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("status", { ascending: false }); // Pending at top

  if (error) {
    console.error("Failed to load testimonials:", error);
  }

  return <TestimonialsManager initialTestimonials={testimonials || []} />;
}
