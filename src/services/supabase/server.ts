import "server-only";

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

/**
 * Creates an elevated server-only client. Never import this function from
 * client components, never expose its key, and use it only after RLS-safe
 * request authorization has been implemented in a future phase.
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
