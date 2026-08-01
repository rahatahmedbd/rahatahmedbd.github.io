import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ProjectChat } from "./project-chat";

export const metadata = {
  title: "Project Chat | Client Portal",
};

export default async function ClientMessagesPage() {
  const { user, profile } = await getCurrentUser();
  if (!user || !profile) redirect("/login");

  const supabase = await getSupabaseServerClient();

  // Fetch client projects to associate conversations
  const { data: projects } = await supabase
    .from("orders")
    .select("id, reference, website_type")
    .or(`client_id.eq.${user.id},client_info->>email.eq.${user.email}`);

  let initialMessages: any[] = [];
  if (projects && projects.length > 0) {
    const projectIds = projects.map((p) => p.id);
    const { data: messages } = await supabase
      .from("project_messages")
      .select("*, profiles(full_name, avatar_url)")
      .in("order_id", projectIds)
      .order("created_at", { ascending: true });
    initialMessages = messages || [];
  }

  return (
    <ProjectChat
      projects={projects || []}
      initialMessages={initialMessages}
      profile={profile}
    />
  );
}
