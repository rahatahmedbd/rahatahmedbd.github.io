import fs from "node:fs";
import path from "node:path";
import LegacySite from "./LegacySite";

// Phase 00 — faithful port: the original site body is rendered verbatim.
export const dynamic = "force-static";

export default function Page() {
  const html = fs.readFileSync(
    path.join(process.cwd(), "private/legacy-body.html"),
    "utf8"
  );
  return <LegacySite html={html} />;
}
