"use client";

import dynamic from "next/dynamic";

/**
 * The gate is client-only and code-split: visitors who already chose an
 * experience never download it.
 */
const EntryGate = dynamic(
  () => import("./entry-gate").then((m) => m.EntryGate),
  { ssr: false }
);

export function GateMount() {
  return <EntryGate defaultOpen />;
}
