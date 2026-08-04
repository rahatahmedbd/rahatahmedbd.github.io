import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Project } from "@/types/database";
import { PortfolioClient } from "./portfolio-client";

/**
 * Case studies are CMS-driven. If Supabase is unreachable — or nothing is
 * published yet — the client renders an honest empty state rather than
 * inventing work that does not exist.
 */
export async function Portfolio() {
  let projects: Project[] = [];

  try {
    const supabase = await getSupabaseServerClient();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("status", "published")
      .order("featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .limit(6);
    projects = (data as Project[]) ?? [];
  } catch {
    // Public pages never fail on a data outage.
  }

  return <PortfolioClient projects={projects} />;
}
