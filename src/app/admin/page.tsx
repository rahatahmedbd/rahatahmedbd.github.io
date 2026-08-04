import { Suspense } from "react";

import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { Container } from "@/components/ui/container";

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
