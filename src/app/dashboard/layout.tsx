import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { DashboardLayoutClient } from "./dashboard-layout-client";

export const metadata = {
  title: "Client Portal & Dashboard | Rahat Ahmed",
  description: "Securely track your active web agency projects, invoices, revisions and messages.",
};

export default async function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getCurrentUser();

  // Route guard: must be authenticated
  if (!user || !profile) {
    redirect("/login");
  }

  // Fetch unread notifications count for badge (user-scoped for security)
  const supabase = await getSupabaseServerClient();
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  return (
    <DashboardLayoutClient profile={profile} initialUnreadCount={count ?? 0}>
      {children}
    </DashboardLayoutClient>
  );
}
