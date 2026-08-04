import type { ReactNode } from "react";

type SiteShellProps = Readonly<{
  children: ReactNode;
}>;

/**
 * The Phase 0 composition boundary for shared site chrome. It intentionally
 * adds no wrapper element, preserving the original portfolio layout exactly.
 */
export function SiteShell({ children }: SiteShellProps) {
  return children;
}
