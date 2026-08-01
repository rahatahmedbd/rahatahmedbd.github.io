import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, publicEnv } from "@/config/env";

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;
  
  // Clone headers and set x-pathname
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  let supabaseResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (!isSupabaseConfigured) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    publicEnv.supabaseUrl,
    publicEnv.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get current user (this automatically refreshes the session if expired)
  const { data: { user } } = await supabase.auth.getUser();

  // Protect admin and dashboard routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
    if (!user) {
      // User is not logged in, redirect to login page with original destination as next query param
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // User is logged in, fetch their profile to check role & status
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, role_id, is_active")
      .eq("id", user.id)
      .single();

    if (!profile || !profile.is_active) {
      // Profile inactive or not found
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Admin routes protection
    if (pathname.startsWith("/admin")) {
      const isAdmin =
        profile.role === "admin" ||
        profile.role_id === "super_admin" ||
        profile.role_id === "admin";
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

    // Dashboard (Client/Staff) routes protection
    if (pathname.startsWith("/dashboard")) {
      const allowedRoles = [
        "super_admin",
        "admin",
        "manager",
        "developer",
        "designer",
        "content_manager",
        "support_agent",
        "client",
      ];
      const hasAccess =
        allowedRoles.includes(profile.role_id || "") ||
        profile.role === "admin" ||
        profile.role === "client";
      if (!hasAccess) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }
  }

  // Redirect logged-in users away from auth pages
  if (user && (pathname === "/login" || pathname === "/forgot-password")) {
    // Determine where to redirect based on their role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, role_id")
      .eq("id", user.id)
      .single();

    const isAdmin =
      profile?.role === "admin" ||
      profile?.role_id === "super_admin" ||
      profile?.role_id === "admin";

    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Set the x-pathname on the response headers too
  supabaseResponse.headers.set("x-pathname", pathname);

  return supabaseResponse;
}
