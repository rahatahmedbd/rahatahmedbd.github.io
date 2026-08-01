import { getSupabaseServerClient } from "@/lib/supabase/server";
import { SearchResults } from "./search-results";

export const metadata = {
  title: "Global Search | Super Admin",
};

export default async function AdminSearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";
  const supabase = await getSupabaseServerClient();

  let clients: any[] = [];
  let orders: any[] = [];
  let portfolio: any[] = [];
  let testimonials: any[] = [];
  let invoices: any[] = [];
  let faqs: any[] = [];

  if (query.trim().length >= 2) {
    const likeQuery = `%${query}%`;

    // Query in parallel
    const [
      { data: clRes },
      { data: ordRes },
      { data: portRes },
      { data: testRes },
      { data: invRes },
      { data: faqRes },
    ] = await Promise.all([
      supabase.from("profiles").select("id, full_name, email, role_id").or(`full_name.ilike.${likeQuery},email.ilike.${likeQuery}`),
      supabase.from("orders").select("id, reference, website_type, status, client_info").or(`reference.ilike.${likeQuery},website_type.ilike.${likeQuery}`),
      supabase.from("projects").select("id, title, slug, status").or(`title.ilike.${likeQuery},slug.ilike.${likeQuery}`),
      supabase.from("testimonials").select("id, author_name, content, status").or(`author_name.ilike.${likeQuery},content.ilike.${likeQuery}`),
      supabase.from("invoices").select("id, number, amount, status").ilike("number", likeQuery),
      supabase.from("faqs").select("id, question, answer, category").or(`question.ilike.${likeQuery},answer.ilike.${likeQuery}`),
    ]);

    clients = clRes || [];
    orders = ordRes || [];
    portfolio = portRes || [];
    testimonials = testRes || [];
    invoices = invRes || [];
    faqs = faqRes || [];
  }

  return (
    <SearchResults
      query={query}
      clients={clients}
      orders={orders}
      portfolio={portfolio}
      testimonials={testimonials}
      invoices={invoices}
      faqs={faqs}
    />
  );
}
