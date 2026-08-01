export interface ListOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ListResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Normalize unknown errors into standard Error instances.
 */
export function toServiceError(
  error: unknown,
  defaultMessage = "Service operation failed"
): Error {
  if (error instanceof Error) {
    return error;
  }
  if (typeof error === "string") {
    return new Error(error);
  }
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return new Error((error as { message: string }).message);
  }
  return new Error(defaultMessage);
}

/**
 * Helper to compute query ranges and construct a standard ListResult.
 */
export function buildListResult<T>(
  data: T[] | null | undefined,
  count: number | null | undefined,
  page: number,
  limit: number
): ListResult<T> {
  const total = count ?? 0;
  const totalPages = Math.ceil(total / limit) || 1;
  return {
    data: data ?? [],
    total,
    page,
    limit,
    totalPages,
  };
}
