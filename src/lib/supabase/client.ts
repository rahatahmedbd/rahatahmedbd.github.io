import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client (Phase 1 readiness — not wired to any UI yet).
 *
 * Lazily instantiated so the build does not require Supabase credentials.
 * When the Auth/DB/Storage phases ship, import this from client components.
 *
 * IMPORTANT: the anon key is public-by-design; every table MUST have
 * Row Level Security (RLS) policies enabled in the Supabase dashboard.
 * For privileged server-side operations use a service-role key in a
 * Server Component / Route Handler / Server Action (never in the browser).
 */
let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }

  browserClient = createClient(url, anonKey, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
  return browserClient;
}
