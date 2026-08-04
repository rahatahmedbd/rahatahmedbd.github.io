import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const environmentKeys = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const envFile = resolve(process.cwd(), ".env.local");

function readEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return {};
  }

  return Object.fromEntries(
    readFileSync(filePath, "utf8")
      .split(/\r?\n/u)
      .filter((line) => line.trim() && !line.trimStart().startsWith("#"))
      .map((line) => {
        const separatorIndex = line.indexOf("=");
        if (separatorIndex === -1) {
          return [line.trim(), ""];
        }

        const key = line.slice(0, separatorIndex).trim();
        const value = line
          .slice(separatorIndex + 1)
          .trim()
          .replace(/^['"]|['"]$/gu, "");
        return [key, value];
      }),
  );
}

const fileValues = readEnvFile(envFile);
const values = Object.fromEntries(
  environmentKeys.map((key) => [key, process.env[key] ?? fileValues[key] ?? ""]),
);
const isSet = (key) => Boolean(values[key]?.trim());
const errors = [];

if (isSet("NEXT_PUBLIC_SUPABASE_URL")) {
  try {
    const url = new URL(values.NEXT_PUBLIC_SUPABASE_URL);
    if (url.protocol !== "https:") {
      errors.push("NEXT_PUBLIC_SUPABASE_URL must use https.");
    }
  } catch {
    errors.push("NEXT_PUBLIC_SUPABASE_URL must be a valid URL.");
  }
}

if (isSet("NEXT_PUBLIC_SUPABASE_URL") !== isSet("NEXT_PUBLIC_SUPABASE_ANON_KEY")) {
  errors.push("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set together.");
}

if (isSet("CLOUDINARY_API_KEY") !== isSet("CLOUDINARY_API_SECRET")) {
  errors.push("CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET must be set together.");
}

if (errors.length > 0) {
  console.error("Environment validation failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

const configured = environmentKeys.filter(isSet).length;
if (configured === 0) {
  console.log("Environment validation passed: integrations are intentionally unconfigured.");
} else {
  console.log("Environment validation passed: configured variable names are structurally valid.");
}
