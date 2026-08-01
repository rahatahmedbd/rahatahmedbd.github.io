import { getSupabaseServerClient } from "@/lib/supabase/server";
import { SettingsForm } from "./settings-form";

export const metadata = {
  title: "Website Settings | Super Admin",
};

export default async function AdminSettingsPage() {
  const supabase = await getSupabaseServerClient();
  
  // Select settings where key is 'general_settings'
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("key", "general_settings")
    .maybeSingle();

  if (error) {
    console.error("Failed to load settings:", error);
  }

  const currentSettings = data?.value || {};

  return <SettingsForm currentSettings={currentSettings} />;
}
