import { getSupabaseServerClient } from "@/lib/supabase/server";
import { TestimonialsClient } from "./testimonials-client";

export async function Testimonials() {
  let testimonialsData: any[] = [];
  try {
    const supabase = await getSupabaseServerClient();
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .eq("status", "approved");
    testimonialsData = data || [];
  } catch {
    // ignore
  }

  return <TestimonialsClient dbTestimonials={testimonialsData} />;
}
