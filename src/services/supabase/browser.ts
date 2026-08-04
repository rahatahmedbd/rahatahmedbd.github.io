"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getPublicEnvironment, isPublicSupabaseConfigured } from "@/config/public-env";

/**
 * Creates a browser-safe Supabase client. The SSR helper stores auth state in
 * secure cookies so middleware, server routes, and client components all share
 * one session without exposing service-role credentials.
 */
export function createSupabaseBrowserClient(): SupabaseClient {
  const environment = getPublicEnvironment();
  const url = environment.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = environment.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isPublicSupabaseConfigured(environment) || !url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to the environment.",
    );
  }

  return createBrowserClient(url, anonKey);
}
