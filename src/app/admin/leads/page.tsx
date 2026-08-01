import { getSupabaseServerClient } from "@/lib/supabase/server";
import { LeadsCRM } from "./leads-crm";

export const metadata = {
  title: "Leads CRM | Super Admin",
};

export default async function AdminLeadsPage() {
  const supabase = await getSupabaseServerClient();
  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load CRM leads:", error);
  }

  return <LeadsCRM initialLeads={leads || []} />;
}
