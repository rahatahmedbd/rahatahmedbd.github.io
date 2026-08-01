import { getSupabaseServerClient } from "@/lib/supabase/server";
import { InvoicesManager } from "./invoices-manager";

export const metadata = {
  title: "Invoices & Billing | Super Admin",
};

export default async function AdminInvoicesPage() {
  const supabase = await getSupabaseServerClient();

  // Fetch invoices, profiles, and active orders in parallel
  const [
    { data: invoices, error: invErr },
    { data: profiles, error: pErr },
    { data: orders, error: oErr },
  ] = await Promise.all([
    supabase.from("invoices").select("*, orders(reference, website_type), profiles(full_name, email)").order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, full_name, email").order("full_name", { ascending: true }),
    supabase.from("orders").select("id, reference, website_type").order("created_at", { ascending: false }),
  ]);

  if (invErr) console.error("Failed to load invoices:", invErr);
  if (pErr) console.error("Failed to load profiles:", pErr);
  if (oErr) console.error("Failed to load orders:", oErr);

  return (
    <InvoicesManager
      initialInvoices={invoices || []}
      clients={profiles || []}
      orders={orders || []}
    />
  );
}
