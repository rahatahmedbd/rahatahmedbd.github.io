"use client";
import { FileVaultUI } from "@/components/mission-control/file-vault-ui";

export function FileManager({ initialProjects }: { initialProjects: any[] }) {
  return <FileVaultUI projects={initialProjects} />;
}
