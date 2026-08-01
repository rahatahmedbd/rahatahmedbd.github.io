import { getSupabaseServerClient } from "@/lib/supabase/server";
import { MediaLibrary } from "./media-library";

export const metadata = {
  title: "Media Library | Super Admin",
};

export default async function AdminMediaPage() {
  const supabase = await getSupabaseServerClient();
  const { data: assets, error } = await supabase
    .from("file_assets")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Failed to load file assets:", error);
  }

  return <MediaLibrary initialAssets={assets || []} />;
}
