"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MissionShell } from "@/components/mission-control/mission-shell";

interface DashboardLayoutClientProps {
  profile: any;
  initialUnreadCount: number;
  children: React.ReactNode;
}

export function DashboardLayoutClient({
  profile,
  initialUnreadCount,
  children,
}: DashboardLayoutClientProps) {
  const pathname = usePathname();
  const [missionCount, setMissionCount] = useState(0);
  const [unread, setUnread] = useState(initialUnreadCount);

  // Optional: live update unread count via supabase realtime could be added
  useEffect(()=>{
    setUnread(initialUnreadCount);
  },[initialUnreadCount]);

  // Try to estimate mission count from localStorage cache or just show unread + placeholder
  useEffect(()=>{
    // Listen for global mission count event
    const handler = (e:any) => {
      if (e.detail?.count) setMissionCount(e.detail.count);
      if (e.detail?.unread !== undefined) setUnread(e.detail.unread);
    };
    window.addEventListener("mission-control:update", handler as any);
    return ()=>window.removeEventListener("mission-control:update", handler as any);
  },[]);

  return (
    <MissionShell unread={unread} missionCount={missionCount || 3}>
      {/* Global style overrides for mission control theme */}
      <style>{`
        /* Ensure scrollbar styling matches mission control */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 999px; }
        ::-webkit-scrollbar-track { background: transparent; }
      `}</style>
      {children}
    </MissionShell>
  );
}
