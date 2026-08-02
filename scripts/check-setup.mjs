#!/usr/bin/env node
/**
 * Checks whether the two required setup steps are done.
 *   node scripts/check-setup.mjs
 *
 * Reads .env.local if present, otherwise the current environment.
 * Read-only: it never writes anything and never prints secret values.
 */

import { readFileSync, existsSync } from "node:fs";

function loadEnv() {
  const env = { ...process.env };
  if (!existsSync(".env.local")) return env;

  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    if (!env[key]) env[key] = t.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = loadEnv();
const has = (k) => Boolean(env[k] && !/^your_|_here$/.test(env[k]));

const pass = (m) => console.log(`  \x1b[32mOK\x1b[0m    ${m}`);
const warn = (m) => console.log(`  \x1b[33mNOTE\x1b[0m  ${m}`);
const fail = (m) => console.log(`  \x1b[31mMISS\x1b[0m  ${m}`);

console.log("\nSupabase");
const sbReady = has("NEXT_PUBLIC_SUPABASE_URL") && has("NEXT_PUBLIC_SUPABASE_ANON_KEY");
sbReady
  ? pass("URL and anon key are set")
  : fail("NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY missing");

has("SUPABASE_SERVICE_ROLE_KEY")
  ? pass("Service role key set (admin notifications will fan out)")
  : warn("SUPABASE_SERVICE_ROLE_KEY not set — optional, notifications degrade gracefully");

console.log("\nMigration 0009");
console.log("  This cannot be checked from here — run in the Supabase SQL Editor:");
console.log("    select count(*) from pg_policies where tablename = 'orders';");
console.log("  Expect 4. See SETUP_REQUIRED.md step 1.");

console.log("\nFile uploads");
const cloud = has("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
const preset = has("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET");
const signing = has("CLOUDINARY_API_KEY") && has("CLOUDINARY_API_SECRET");

if (!cloud) {
  fail("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME missing — uploads disabled");
} else if (preset) {
  pass("Unsigned preset set — public and client uploads work");
} else if (signing) {
  warn("No public preset, but signing keys present — admin uploads only");
} else {
  warn("No preset — uploads are cleanly disabled (this is a valid choice)");
  console.log("        Users are told to send files by email. Nothing is lost.");
}

if (env.NEXT_PUBLIC_CLOUDINARY_API_SECRET || env.NEXT_PUBLIC_CLOUDINARY_API_KEY) {
  console.log(
    "\n  \x1b[31mSECURITY\x1b[0m  A Cloudinary key/secret is prefixed NEXT_PUBLIC_ and is\n" +
      "            exposed to the browser. Remove the prefix and rotate the secret."
  );
}

console.log("\nDone. Full instructions: SETUP_REQUIRED.md\n");
