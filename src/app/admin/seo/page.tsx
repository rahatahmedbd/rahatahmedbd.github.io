import { getSupabaseServerClient } from "@/lib/supabase/server";
import { SeoManagerForm } from "./seo-form";

export const metadata = {
  title: "SEO Management | Super Admin",
};

export default async function AdminSeoPage() {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase
    .from("settings")
    .select("*")
    .eq("key", "seo_settings")
    .maybeSingle();

  const seoSettings = data?.value || {};

  return <SeoManagerForm initialSeo={seoSettings} />;
}
