import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";
import { ProjectsList } from "./projects-list";

export const metadata = {
  title: "My Projects | Client Portal",
};

export default async function ClientProjectsPage() {
  const { user } = await getCurrentUser();
  const supabase = await getSupabaseServerClient();

  // Fetch client projects (orders)
  const { data: projects, error } = await supabase
    .from("orders")
    .select("*")
    .or(`client_id.eq.${user?.id},client_info->>email.eq.${user?.email}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load client projects:", error);
  }

  return <ProjectsList initialProjects={projects || []} />;
}
