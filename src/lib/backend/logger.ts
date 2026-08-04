import "server-only";

import { createSupabaseAdminClient } from "@/services/supabase/server";

export async function logPlatformError(
  context: string,
  error: unknown,
  metadata?: unknown,
): Promise<void> {
  const errorMessage = error instanceof Error ? error.message : String(error);

  console.error(`[${context}]`, errorMessage, metadata ?? "");

  try {
    const supabase = createSupabaseAdminClient();
    await supabase.from("error_logs").insert({
      context,
      message: errorMessage,
      metadata: metadata ?? null,
    });
  } catch {
    // Logging must never fail the user-facing request.
  }
}
