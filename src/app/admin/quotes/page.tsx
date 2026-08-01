import { getSupabaseServerClient } from "@/lib/supabase/server";
import { QuotesProposals } from "./quotes-proposals";

export const metadata = {
  title: "Quotes & Proposals | Super Admin",
};

export default async function AdminQuotesPage() {
  const supabase = await getSupabaseServerClient();

  // Fetch quotes, profiles, and active orders in parallel
  const [
    { data: quotes, error: qErr },
    { data: profiles, error: pErr },
    { data: orders, error: oErr },
  ] = await Promise.all([
    supabase.from("quotes").select("*, orders(reference, website_type), profiles(full_name, email)").order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, full_name, email").order("full_name", { ascending: true }),
    supabase.from("orders").select("id, reference, website_type").order("created_at", { ascending: false }),
  ]);

  if (qErr) console.error("Failed to load quotes:", qErr);
  if (pErr) console.error("Failed to load profiles:", pErr);
  if (oErr) console.error("Failed to load orders:", oErr);

  return (
    <QuotesProposals
      initialQuotes={quotes || []}
      clients={profiles || []}
      orders={orders || []}
    />
  );
}
