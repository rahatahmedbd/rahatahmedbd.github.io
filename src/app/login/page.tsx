import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";

import { AuthPanel } from "@/components/auth/auth-panel";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Sign In — Rahat Platform",
  description: "Sign in to the Rahat Platform to manage orders, files and messages.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] py-24">
      <Container size="md">
        <div className="mb-8">
          <Link href="/" className="text-sm text-[var(--color-brand-primary)]">
            ← Back to Rahat&apos;s World
          </Link>
        </div>
        <Suspense fallback={<div>Loading secure auth…</div>}>
          <AuthPanel />
        </Suspense>
      </Container>
    </main>
  );
}
