import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { NotificationsManager } from "./notifications-manager";

export const metadata = {
  title: "System Notifications | Super Admin",
};

export default async function AdminNotificationsPage() {
  const { user, profile } = await getCurrentUser();

  if (!user || !profile) {
    redirect("/login");
  }

  const supabase = await getSupabaseServerClient();
  const { data: notifications, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load notifications:", error);
  }

  return (
    <NotificationsManager
      initialNotifications={notifications || []}
    />
  );
}
