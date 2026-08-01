import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ServicesClient } from "./services-client";

export async function Services() {
  let servicesData: any[] = [];
  try {
    const supabase = await getSupabaseServerClient();
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("is_enabled", true)
      .order("sort_order", { ascending: true });
    servicesData = data || [];
  } catch {
    // ignore
  }

  return <ServicesClient dbServices={servicesData} />;
}
