"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session, SupabaseClient, User } from "@supabase/supabase-js";

import { createSupabaseBrowserClient } from "@/services/supabase/browser";

interface PlatformAuthState {
  client: SupabaseClient | null;
  session: Session | null;
  user: User | null;
  isConfigured: boolean;
  isLoading: boolean;
  error: string;
  getAccessToken: () => Promise<string | null>;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

interface AuthClientConfig {
  client: SupabaseClient | null;
  isConfigured: boolean;
  error: string;
}

export function usePlatformAuth(): PlatformAuthState {
  const [config] = useState<AuthClientConfig>(() => {
    try {
      return { client: createSupabaseBrowserClient(), isConfigured: true, error: "" };
    } catch (authError) {
      return {
        client: null,
        isConfigured: false,
        error: authError instanceof Error ? authError.message : "Authentication is unavailable.",
      };
    }
  });
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(config.client));
  const [error, setError] = useState(config.error);

  useEffect(() => {
    if (!config.client) return;

    let mounted = true;
    const supabase = config.client;

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!mounted) return;
      if (sessionError) setError(sessionError.message);
      setSession(data.session);
      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [config.client]);

  const refresh = useCallback(async () => {
    if (!config.client) return;
    const { data, error: sessionError } = await config.client.auth.getSession();
    if (sessionError) setError(sessionError.message);
    setSession(data.session);
  }, [config.client]);

  const getAccessToken = useCallback(async () => {
    if (!config.client) return null;
    const { data, error: sessionError } = await config.client.auth.getSession();
    if (sessionError) {
      setError(sessionError.message);
      return null;
    }
    setSession(data.session);
    return data.session?.access_token ?? null;
  }, [config.client]);

  const signOut = useCallback(async () => {
    if (!config.client) return;
    await config.client.auth.signOut();
    setSession(null);
  }, [config.client]);

  return useMemo(
    () => ({
      client: config.client,
      session,
      user: session?.user ?? null,
      isConfigured: config.isConfigured,
      isLoading,
      error,
      getAccessToken,
      refresh,
      signOut,
    }),
    [
      config.client,
      config.isConfigured,
      error,
      getAccessToken,
      isLoading,
      refresh,
      session,
      signOut,
    ],
  );
}
