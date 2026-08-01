import { ForgotPasswordForm } from "./forgot-form";

export const metadata = {
  title: "Forgot Password",
  description: "Request a secure password reset link.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
