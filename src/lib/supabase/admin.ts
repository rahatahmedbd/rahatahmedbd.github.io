import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseAdminAvailable, publicEnv, serverEnv } from "@/config/env";

let adminClient: SupabaseClient | null = null;

/**
 * Privileged server-only Supabase client using the Service Role Key.
 * Bypasses RLS. Never use in client components or expose to the browser.
 */
export function getSupabaseAdminClient(): SupabaseClient {
  if (adminClient) return adminClient;

  if (!isSupabaseAdminAvailable) {
    throw new Error(
      "Supabase Admin is not available. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server environment."
    );
  }

  adminClient = createClient(
    publicEnv.supabaseUrl,
    serverEnv.supabaseServiceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  return adminClient;
}
