/**
 * RahatVerse V2 — Experience mode
 *
 * The same information, the same backend, the same actions … presented through
 * two very different doors:
 *
 *   • "site"  → Website Experience — premium, minimal, fast.
 *   • "verse" → RahatVerse — the same content inside a 3D cinematic city tour.
 *
 * The visitor's choice is stored in a cookie so the welcome gate is shown once
 * (and can always be re-opened from the navbar / footer switcher).
 */

export type ExperienceMode = "site" | "verse";

export const EXPERIENCE_COOKIE = "rv-experience";
/** 180 days. */
export const EXPERIENCE_MAX_AGE = 60 * 60 * 24 * 180;

export const EXPERIENCE_ROUTES: Record<ExperienceMode, string> = {
  site: "/",
  verse: "/rahatverse",
};

export function isExperienceMode(value: unknown): value is ExperienceMode {
  return value === "site" || value === "verse";
}

/** Client-side read of the stored preference. */
export function readExperienceMode(): ExperienceMode | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${EXPERIENCE_COOKIE}=`));
  const value = match?.split("=")[1];
  return isExperienceMode(value) ? value : null;
}

/** Client-side write. `remember = false` keeps it to the session only. */
export function writeExperienceMode(mode: ExperienceMode, remember = true) {
  if (typeof document === "undefined") return;
  const parts = [
    `${EXPERIENCE_COOKIE}=${mode}`,
    "path=/",
    "samesite=lax",
    ...(remember ? [`max-age=${EXPERIENCE_MAX_AGE}`] : []),
  ];
  document.cookie = parts.join("; ");
}

/** Forget the preference so the welcome gate shows again. */
export function clearExperienceMode() {
  if (typeof document === "undefined") return;
  document.cookie = `${EXPERIENCE_COOKIE}=; path=/; max-age=0; samesite=lax`;
}
