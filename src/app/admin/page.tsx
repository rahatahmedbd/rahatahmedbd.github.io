import { Suspense } from "react";
import type { Metadata } from "next";

import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Admin Panel — Rahat Platform",
  description: "Secure administration panel for managing orders, content, media and analytics.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] py-24">
      <Container size="xl">
        <Suspense fallback={<div>Loading admin dashboard…</div>}>
          <AdminDashboard />
        </Suspense>
      </Container>
    </main>
  );
}
