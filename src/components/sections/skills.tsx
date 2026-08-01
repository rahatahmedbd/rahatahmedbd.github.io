import { getSupabaseServerClient } from "@/lib/supabase/server";
import { SkillsClient } from "./skills-client";

export async function Skills() {
  let skillsData: any[] = [];
  try {
    const supabase = await getSupabaseServerClient();
    const { data } = await supabase
      .from("skills")
      .select("*")
      .order("sort_order", { ascending: true });
    skillsData = data || [];
  } catch {
    // ignore
  }

  return <SkillsClient dbSkills={skillsData} />;
}
