import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { InvoicesList } from "./invoices-list";

export const metadata = {
  title: "Invoices & Fees | Client Portal",
};

export default async function ClientInvoicesPage() {
  const { user } = await getCurrentUser();
  if (!user) redirect("/login");

  const supabase = await getSupabaseServerClient();

  // Fetch client projects to associate prices/invoices
  const { data: projects } = await supabase
    .from("orders")
    .select("id, reference, website_type, estimated_cost, final_price, status, created_at")
    .or(`client_id.eq.${user.id},client_info->>email.eq.${user.email}`)
    .order("created_at", { ascending: false });

  return <InvoicesList projects={projects || []} />;
}
