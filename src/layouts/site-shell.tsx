import type { ReactNode } from "react";

import { PlatformErrorBoundary } from "@/components/platform/platform-error-boundary";
import { PremiumTopbar } from "@/components/platform/topbar";
import { PlatformProvider } from "@/state/platform-context";

type SiteShellProps = Readonly<{
  children: ReactNode;
}>;

/**
 * Root composition boundary for the shared platform. The provider and chrome
 * stay mounted across App Router transitions, so switching experiences does
 * not discard tour, preference, or order state.
 *
 * Phase 2: Replaced legacy floating menu with PremiumTopbar
 * that matches the exact required control set:
 * - Brand / short identity
 * - Experience switcher (Website ↔ RahatVerse)
 * - Dark / Light mode toggle
 * - Language switcher
 * - Three-dot menu
 */
export function SiteShell({ children }: SiteShellProps) {
  return (
    <PlatformProvider>
      <PlatformErrorBoundary>
        <PremiumTopbar />
        {children}
      </PlatformErrorBoundary>
    </PlatformProvider>
  );
}
