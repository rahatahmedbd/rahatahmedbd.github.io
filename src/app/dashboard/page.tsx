import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";
import { MissionControlOverview } from "@/components/mission-control/mission-control-overview";

export const metadata = {
  title: "Mission Control | Command Deck",
};

export default async function ClientDashboardOverviewPage() {
  const { user, profile } = await getCurrentUser();
  const supabase = await getSupabaseServerClient();

  // Fetch client projects
  const { data: projects } = await supabase
    .from("orders")
    .select("*")
    .or(`client_id.eq.${user?.id},client_info->>email.eq.${user?.email}`)
    .order("created_at", { ascending: false });

  const clientProjects = projects || [];

  let projectMessages: any[] = [];
  let notifications: any[] = [];
  if (clientProjects.length > 0) {
    const projectIds = clientProjects.map((p) => p.id);
    const [{ data: msgs }, { data: notifs }] = await Promise.all([
      supabase.from("project_messages").select("*, profiles(full_name, avatar_url)").in("order_id", projectIds).order("created_at", { ascending: true }).limit(100),
      supabase.from("notifications").select("*").eq("user_id", user?.id).order("created_at", { ascending: false }).limit(30),
    ]);
    projectMessages = msgs || [];
    notifications = notifs || [];
  } else {
    const { data: notifs } = await supabase.from("notifications").select("*").eq("user_id", user?.id).order("created_at", { ascending: false }).limit(20);
    notifications = notifs || [];
  }

  // If no projects, count is zero else expose
  // We also push mission count to client via script tag for shell
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.addEventListener('DOMContentLoaded',()=>{window.dispatchEvent(new CustomEvent('mission-control:update',{detail:{count:${clientProjects.length}, unread:${notifications.filter((n:any)=>!n.is_read).length}}}))});`,
        }}
      />
      <MissionControlOverview
        profile={profile}
        projects={clientProjects}
        messages={projectMessages}
        notifications={notifications}
      />
    </>
  );
}
