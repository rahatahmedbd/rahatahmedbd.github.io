import type { ReactNode } from "react";

import { PlatformErrorBoundary } from "@/components/platform/platform-error-boundary";
import { PlatformNavigation } from "@/components/platform/platform-navigation";
import { PlatformProvider } from "@/state/platform-context";

type SiteShellProps = Readonly<{
  children: ReactNode;
}>;

/**
 * Root composition boundary for the shared platform. The provider and chrome
 * stay mounted across App Router transitions, so switching experiences does
 * not discard tour, preference, or order state.
 */
export function SiteShell({ children }: SiteShellProps) {
  return (
    <PlatformProvider>
      <PlatformErrorBoundary>
        <PlatformNavigation />
        {children}
      </PlatformErrorBoundary>
    </PlatformProvider>
  );
}
