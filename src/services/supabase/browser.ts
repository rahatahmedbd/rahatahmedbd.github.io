"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getPublicEnvironment, isPublicSupabaseConfigured } from "@/config/public-env";

/**
 * Creates a browser-safe Supabase client only after public configuration exists.
 * No service-role credential can enter this module or a client bundle.
 */
export function createSupabaseBrowserClient(): SupabaseClient {
  const environment = getPublicEnvironment();
  const url = environment.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = environment.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isPublicSupabaseConfigured(environment) || !url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
    );
  }

  return createClient(url, anonKey);
}
