import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import {
  getServerEnvironment,
  isSupabaseAdminConfigured,
  isSupabaseConfigured,
} from "@/config/env";

/**
 * Creates a server client using the public anon key. Use this for normal
 * server-side requests that should still be constrained by Supabase RLS.
 */
export function createSupabaseServerClient(): SupabaseClient {
  const environment = getServerEnvironment();
  const url = environment.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = environment.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isSupabaseConfigured(environment) || !url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to server environment variables.",
    );
  }

  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/** Creates a cookie-aware server component client for Supabase Auth/RLS. */
export async function createSupabaseCookieClient(): Promise<SupabaseClient> {
  const environment = getServerEnvironment();
  const url = environment.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = environment.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isSupabaseConfigured(environment) || !url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to server environment variables.",
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot always mutate cookies. Middleware refreshes
          // sessions before protected pages render, so this is safe to ignore.
        }
      },
    },
  });
}

/**
 * Creates an elevated server-only client. Never import this function from
 * client components and never expose its key. Route handlers must authorize the
 * requester before calling data paths that use this client.
 */
export function createSupabaseAdminClient(): SupabaseClient {
  const environment = getServerEnvironment();
  const url = environment.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = environment.SUPABASE_SERVICE_ROLE_KEY;

  if (!isSupabaseAdminConfigured(environment) || !url || !serviceRoleKey) {
    throw new Error(
      "Supabase admin access is not configured. Add SUPABASE_SERVICE_ROLE_KEY to the server environment.",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
