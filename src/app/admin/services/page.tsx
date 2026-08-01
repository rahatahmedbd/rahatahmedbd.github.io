import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ServicesManager } from "./services-manager";

export const metadata = {
  title: "Services Manager | Super Admin",
};

export default async function AdminServicesPage() {
  const supabase = await getSupabaseServerClient();
  const { data: services, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load services:", error);
  }

  return <ServicesManager initialServices={services || []} />;
}
