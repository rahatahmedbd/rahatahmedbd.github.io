import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ClientNotificationsManager } from "./notifications-manager";

export const metadata = {
  title: "My Alerts & Notifications | Client Portal",
};

export default async function ClientNotificationsPage() {
  const { user } = await getCurrentUser();
  if (!user) redirect("/login");

  const supabase = await getSupabaseServerClient();
  const { data: notifications, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load notifications:", error);
  }

  return <ClientNotificationsManager initialNotifications={notifications || []} />;
}
