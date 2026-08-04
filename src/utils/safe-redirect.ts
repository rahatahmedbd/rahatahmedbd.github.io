/**
 * Validates an internal redirect target coming from user-controlled input
 * (for example the `?next=` query parameter).
 *
 * Only same-site paths are accepted. Protocol-relative URLs (`//evil.com`),
 * absolute URLs, backslash tricks, and javascript/data schemes are rejected
 * so the value can never be passed to `window.location` or a redirect.
 */
export function sanitizeRedirectPath(candidate: string | null, fallback = "/dashboard"): string {
  if (!candidate) return fallback;

  const trimmed = candidate.trim();

  // A safe target is a single-slash relative path with no scheme, no leading
  // second slash, and no backslashes (some browsers normalize `\` to `/`).
  const isSafePath = /^\/(?![/\\])[\w\-./?=&%+]*$/u.test(trimmed);
  if (!isSafePath) return fallback;

  try {
    // Final defense: resolve against the current origin and confirm the target
    // stays on it. In non-browser contexts the fallback origin is neutral.
    const resolved = new URL(trimmed, "https://redirect-guard.invalid");
    if (resolved.origin !== "https://redirect-guard.invalid") return fallback;
  } catch {
    return fallback;
  }

  return trimmed;
}
