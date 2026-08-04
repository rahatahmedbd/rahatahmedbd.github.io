import "server-only";

import type { NextRequest } from "next/server";
import type { User } from "@supabase/supabase-js";

import { getServerEnvironment } from "@/config/env";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/services/supabase/server";

export type PlatformRole = "admin" | "client";

export interface AuthenticatedAccount {
  user: User;
  role: PlatformRole;
  email: string;
}

export class ApiAuthError extends Error {
  constructor(
    message: string,
    public readonly status = 401,
  ) {
    super(message);
  }
}

function getBearerToken(request: NextRequest): string | null {
  const header = request.headers.get("authorization");
  if (!header) return null;

  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token.trim();
}

function configuredAdminEmails(): Set<string> {
  const environment = getServerEnvironment();
  return new Set(
    (environment.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

async function resolveProfileRole(user: User): Promise<PlatformRole> {
  const email = user.email?.toLowerCase() ?? "";
  if (configuredAdminEmails().has(email)) {
    return "admin";
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data?.role === "admin" ? "admin" : "client";
  } catch {
    // If admin credentials are unavailable, never elevate privileges. Client
    // dashboard APIs may still work once Supabase is configured with RLS.
    return "client";
  }
}

export async function requireAuthenticatedAccount(
  request: NextRequest,
): Promise<AuthenticatedAccount> {
  const token = getBearerToken(request);
  if (!token) {
    throw new ApiAuthError("Authentication is required.", 401);
  }

  let user: User | null = null;

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser(token);
    if (error) throw error;
    user = data.user;
  } catch {
    throw new ApiAuthError("Invalid or expired session.", 401);
  }

  if (!user?.email) {
    throw new ApiAuthError("A verified email session is required.", 401);
  }

  return {
    user,
    role: await resolveProfileRole(user),
    email: user.email,
  };
}

export async function requireAdminAccount(request: NextRequest): Promise<AuthenticatedAccount> {
  const account = await requireAuthenticatedAccount(request);

  if (account.role !== "admin") {
    throw new ApiAuthError("Admin access is required.", 403);
  }

  return account;
}
