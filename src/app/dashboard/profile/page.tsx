import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { ClientProfileForm } from "./profile-form";

export const metadata = {
  title: "My Profile | Client Portal",
};

export default async function ClientProfilePage() {
  const { user, profile } = await getCurrentUser();

  if (!user || !profile) {
    redirect("/login");
  }

  return <ClientProfileForm profile={profile} email={user.email || ""} />;
}
