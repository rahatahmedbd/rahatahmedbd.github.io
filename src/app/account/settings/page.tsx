import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AccountSettingsForm } from "./settings-form";

export const metadata = {
  title: "Account Settings & Security",
  description: "Manage your profile, password, session, and security logs.",
};

export default async function AccountSettingsPage() {
  const { user, profile } = await getCurrentUser();

  // If not logged in, redirect to login
  if (!user || !profile) {
    redirect("/login");
  }

  // Fetch their permissions, login history, and active sessions
  const supabase = await getSupabaseServerClient();

  // 1. Fetch user permissions
  const { data: rolePermissions } = await supabase
    .from("role_permissions")
    .select("permission_id")
    .eq("role_id", profile.role_id || "visitor");

  const permissions = rolePermissions?.map((p) => p.permission_id) || [];

  // 2. Fetch login history (last 5 records)
  const { data: loginHistory } = await supabase
    .from("login_history")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // 3. Fetch activity logs (last 5 records)
  const { data: activityLogs } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <AccountSettingsForm
      profile={profile}
      permissions={permissions}
      loginHistory={loginHistory || []}
      activityLogs={activityLogs || []}
    />
  );
}
