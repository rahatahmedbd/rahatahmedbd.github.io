import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { FileManager } from "./file-manager";

export const metadata = {
  title: "File Manager | Client Portal",
};

export default async function ClientFilesPage() {
  const { user } = await getCurrentUser();
  if (!user) redirect("/login");

  const supabase = await getSupabaseServerClient();

  // Fetch client projects to associate files to their reference ID
  const { data: projects } = await supabase
    .from("orders")
    .select("id, reference, website_type, uploaded_files, status, internal_files")
    .or(`client_id.eq.${user.id},client_info->>email.eq.${user.email}`);

  return <FileManager initialProjects={projects || []} />;
}
