import { getSupabaseServerClient } from "@/lib/supabase/server";
import { PortfolioManager } from "./portfolio-manager";

export const metadata = {
  title: "Portfolio CMS | Super Admin",
};

export default async function AdminPortfolioPage() {
  const supabase = await getSupabaseServerClient();
  
  // Fetch projects and categories in parallel
  const [
    { data: projects, error: prjError },
    { data: categories, error: catError },
  ] = await Promise.all([
    supabase.from("projects").select("*, categories(name)").order("sort_order", { ascending: true }),
    supabase.from("categories").select("*").order("sort_order", { ascending: true }),
  ]);

  if (prjError) console.error("Failed to load projects:", prjError);
  if (catError) console.error("Failed to load categories:", catError);

  return (
    <PortfolioManager
      initialProjects={projects || []}
      categories={categories || []}
    />
  );
}
