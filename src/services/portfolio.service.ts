import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  type Category,
  type PortfolioItem,
  type Project,
  type ProjectStatus,
} from "@/types/database";
import {
  type ListOptions,
  type ListResult,
  buildListResult,
  toServiceError,
} from "./base";

export async function listProjects(
  options: ListOptions & {
    categoryId?: string;
    status?: ProjectStatus;
    featured?: boolean;
  } = {}
): Promise<ListResult<Project>> {
  try {
    const supabase = await getSupabaseServerClient();
    const page = options.page ?? 1;
    const limit = options.limit ?? 20;
    const sortBy = options.sortBy ?? "sort_order";
    const sortOrder = options.sortOrder ?? "asc";
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("projects")
      .select("*", { count: "exact" })
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range(from, to);

    if (options.categoryId) {
      query = query.eq("category_id", options.categoryId);
    }
    if (options.status) {
      query = query.eq("status", options.status);
    }
    if (typeof options.featured === "boolean") {
      query = query.eq("featured", options.featured);
    }

    const { data, count, error } = await query;

    if (error) {
      throw error;
    }

    return buildListResult<Project>(data as Project[], count, page, limit);
  } catch (err) {
    throw toServiceError(err, "Failed to list projects");
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return (data as Project) || null;
  } catch (err) {
    throw toServiceError(err, "Failed to fetch project by slug");
  }
}

export async function listCategories(): Promise<Category[]> {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      throw error;
    }

    return (data as Category[]) ?? [];
  } catch (err) {
    throw toServiceError(err, "Failed to list categories");
  }
}

export async function listPortfolioItems(
  options: ListOptions & { published?: boolean } = {}
): Promise<ListResult<PortfolioItem>> {
  try {
    const supabase = await getSupabaseServerClient();
    const page = options.page ?? 1;
    const limit = options.limit ?? 20;
    const sortBy = options.sortBy ?? "sort_order";
    const sortOrder = options.sortOrder ?? "asc";
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("portfolio_items")
      .select("*", { count: "exact" })
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range(from, to);

    if (typeof options.published === "boolean") {
      query = query.eq("published", options.published);
    }

    const { data, count, error } = await query;

    if (error) {
      throw error;
    }

    return buildListResult<PortfolioItem>(
      data as PortfolioItem[],
      count,
      page,
      limit
    );
  } catch (err) {
    throw toServiceError(err, "Failed to list portfolio items");
  }
}
