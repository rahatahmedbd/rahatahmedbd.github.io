import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { sanitizeRedirectPath } from "@/utils/safe-redirect";

const protectedPagePrefixes = ["/admin", "/dashboard"];

const isProduction = process.env.NODE_ENV === "production";

/**
 * Content Security Policy for the production deployment.
 *
 * - Next.js App Router ships inline JSON/flight scripts, so `script-src`
 *   keeps `'unsafe-inline'` but blocks every remote script origin.
 * - Google Fonts is the only external style/font origin.
 * - Supabase REST/realtime and Cloudinary media are the only remote
 *   connection/image targets.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://res.cloudinary.com https://*.supabase.co",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://res.cloudinary.com",
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=()",
  );
  response.headers.set("X-DNS-Prefetch-Control", "on");

  if (isProduction) {
    response.headers.set("Content-Security-Policy", contentSecurityPolicy);
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
    response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
    response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  }

  return response;
}

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  let response = NextResponse.next({ request });

  if (!url || !anonKey) {
    return applySecurityHeaders(response);
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isProtectedPage = protectedPagePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isProtectedPage && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return applySecurityHeaders(NextResponse.redirect(loginUrl));
  }

  if (pathname === "/login" && user) {
    // `next` is user-controlled input — sanitize it so it can never become an
    // open redirect to another origin.
    const nextPath = sanitizeRedirectPath(request.nextUrl.searchParams.get("next"));
    const nextUrl = request.nextUrl.clone();
    nextUrl.pathname = nextPath;
    nextUrl.search = "";
    return applySecurityHeaders(NextResponse.redirect(nextUrl));
  }

  return applySecurityHeaders(response);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets/).*)"],
};
