import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ActivityLogsViewer } from "./logs-viewer";

export const metadata = {
  title: "Activity Logs | Super Admin",
};

export default async function AdminActivityLogsPage() {
  const supabase = await getSupabaseServerClient();
  const { data: logs, error } = await supabase
    .from("activity_logs")
    .select("*, profiles(full_name, email)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load activity logs:", error);
  }

  return <ActivityLogsViewer initialLogs={logs || []} />;
}
