import { hasSuperAdmin } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { SuperAdminInitForm } from "./init-form";

export const metadata = {
  title: "Initialize Super Admin",
  description: "Secure initialization of the first Super Admin account.",
};

export default async function InitSuperAdminPage() {
  const adminExists = await hasSuperAdmin();

  // If Super Admin already exists, redirect or deny access completely
  if (adminExists) {
    redirect("/unauthorized");
  }

  return <SuperAdminInitForm />;
}
