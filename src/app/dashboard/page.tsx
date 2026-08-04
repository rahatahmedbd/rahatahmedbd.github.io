import { Suspense } from "react";

import { ClientDashboard } from "@/components/client/client-dashboard";
import { Container } from "@/components/ui/container";

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
