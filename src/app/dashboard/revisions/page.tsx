import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { RevisionsManager } from "./revisions-manager";

export const metadata = {
  title: "Project Revisions | Client Portal",
};

export default async function ClientRevisionsPage() {
  const { user } = await getCurrentUser();
  if (!user) redirect("/login");

  const supabase = await getSupabaseServerClient();

  // Fetch client projects to associate revisions
  const [
    { data: projects },
    { data: revisions },
  ] = await Promise.all([
    supabase
      .from("orders")
      .select("id, reference, website_type")
      .or(`client_id.eq.${user.id},client_info->>email.eq.${user.email}`),
    supabase
      .from("revisions")
      .select("*, orders(reference, website_type)")
      .eq("client_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <RevisionsManager
      projects={projects || []}
      initialRevisions={revisions || []}
    />
  );
}
