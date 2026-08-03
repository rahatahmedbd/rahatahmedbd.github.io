import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AdminLayoutClient } from "./admin-layout-client";

export const metadata = {
  title: "Super Admin Dashboard | Rahat Ahmed",
  description: "Secure Content Management System & Website Control Panel.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getCurrentUser();

  // Route guard: must be authenticated and have an admin role
  if (!user || !profile) {
    redirect("/login");
  }

  const isAdmin =
    profile.role === "admin" ||
    profile.role_id === "super_admin" ||
    profile.role_id === "admin" ||
    profile.role_id === "manager";

  if (!isAdmin) {
    redirect("/unauthorized");
  }

  // Fetch unread notifications count for badge
  const supabase = await getSupabaseServerClient();
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("is_read", false);

  return (
    <AdminLayoutClient profile={profile} initialUnreadCount={count ?? 0}>
      {children}
    </AdminLayoutClient>
  );
}
