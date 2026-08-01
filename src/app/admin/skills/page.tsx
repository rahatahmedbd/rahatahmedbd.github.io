import { getSupabaseServerClient } from "@/lib/supabase/server";
import { SkillsManager } from "./skills-manager";

export const metadata = {
  title: "Skills CMS | Super Admin",
};

export default async function AdminSkillsPage() {
  const supabase = await getSupabaseServerClient();
  const { data: skills, error } = await supabase
    .from("skills")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load skills:", error);
  }

  return <SkillsManager initialSkills={skills || []} />;
}
