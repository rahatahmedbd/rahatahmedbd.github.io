import { Suspense } from "react";
import { hasSuperAdmin } from "@/app/actions/auth";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Secure Log In",
  description: "Log in to your account securely.",
};

export default async function LoginPage() {
  const adminExists = await hasSuperAdmin();

  return (
    <Suspense fallback={
      <div className="min-h-[85vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-500" />
      </div>
    }>
      <LoginForm adminExists={adminExists} />
    </Suspense>
  );
}
