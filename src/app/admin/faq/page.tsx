import { getSupabaseServerClient } from "@/lib/supabase/server";
import { FaqManager } from "./faq-manager";

export const metadata = {
  title: "FAQ Manager | Super Admin",
};

export default async function AdminFaqPage() {
  const supabase = await getSupabaseServerClient();
  const { data: faqs, error } = await supabase
    .from("faqs")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load FAQs:", error);
  }

  return <FaqManager initialFaqs={faqs || []} />;
}
