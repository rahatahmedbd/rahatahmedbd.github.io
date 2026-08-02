"use client";
import { CommHub } from "@/components/mission-control/comm-hub";

export function ProjectChat({ projects, initialMessages, profile }: { projects: any[]; initialMessages: any[]; profile: any }) {
  return <CommHub projects={projects} initialMessages={initialMessages} profile={profile} />;
}
