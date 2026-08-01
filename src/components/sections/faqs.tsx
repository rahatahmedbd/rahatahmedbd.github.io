import { getSupabaseServerClient } from "@/lib/supabase/server";
import { FaqsClient } from "./faqs-client";

export async function Faqs() {
  let faqsData: any[] = [];
  try {
    const supabase = await getSupabaseServerClient();
    const { data } = await supabase
      .from("faqs")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    faqsData = data || [];
  } catch {
    // ignore
  }

  return <FaqsClient dbFaqs={faqsData} />;
}
