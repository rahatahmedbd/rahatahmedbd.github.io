import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { ProfileForm } from "./profile-form";

export const metadata = {
  title: "Admin Profile | Super Admin",
};

export default async function AdminProfilePage() {
  const { user, profile } = await getCurrentUser();

  if (!user || !profile) {
    redirect("/login");
  }

  return <ProfileForm profile={profile} email={user.email || ""} />;
}
