"use client";

import { usePathname } from "next/navigation";

/**
 * Reserves the height of the fixed mobile bottom navigation so the footer is
 * never hidden behind it. On /order the navigation is replaced by the order
 * flow's own sticky bar, which ships its own clearance — so nothing is added.
 */
export function NavSpacer() {
  const pathname = usePathname();
  if (pathname.startsWith("/order")) return null;
  return <div aria-hidden className="pb-nav" />;
}
