import { Suspense } from "react";
import type { Metadata } from "next";

import { ClientDashboard } from "@/components/client/client-dashboard";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Client Dashboard — Rahat Platform",
  description: "Track your website order progress, download project files and message Rahat.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] py-24">
      <Container size="xl">
        <Suspense fallback={<div>Loading client dashboard…</div>}>
          <ClientDashboard />
        </Suspense>
      </Container>
    </main>
  );
}
