import "server-only";

import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { ApiAuthError } from "@/lib/backend/auth";

export interface ApiErrorPayload {
  error: string;
  issues?: string[];
}

export function apiJson<T>(data: T, init?: ResponseInit): NextResponse<T> {
  return NextResponse.json(data, init);
}

export function apiError(error: unknown, fallbackStatus = 500): NextResponse<ApiErrorPayload> {
  if (error instanceof ApiAuthError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed.",
        issues: error.issues.map((issue) => issue.message),
      },
      { status: 422 },
    );
  }

  if (error instanceof Error) {
    const isConfigurationError = /not configured|environment/iu.test(error.message);
    return NextResponse.json(
      { error: isConfigurationError ? error.message : "Unexpected server error." },
      { status: isConfigurationError ? 503 : fallbackStatus },
    );
  }

  return NextResponse.json({ error: "Unexpected server error." }, { status: fallbackStatus });
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    forwardedFor ??
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    "anonymous"
  );
}
