"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { NotificationCore } from "@/components/mission-control/notification-core";
import { markNotificationReadAction, markAllNotificationsReadAction, deleteNotificationAction } from "@/app/actions/cms";

export function ClientNotificationsManager({ initialNotifications }: { initialNotifications: any[] }) {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [pending, start] = useTransition();

  const handleAction = (type: "read"|"delete"|"readAll", id?: string) => {
    start(async()=>{
      if (type==="read" && id) {
        const res = await markNotificationReadAction(id);
        if (res.success) setNotifications(prev=>prev.map(n=>n.id===id?{...n,is_read:true}:n));
      } else if (type==="readAll") {
        const res = await markAllNotificationsReadAction();
        if (res.success) setNotifications(prev=>prev.map(n=>({...n,is_read:true})));
      } else if (type==="delete" && id) {
        const res = await deleteNotificationAction(id);
        if (res.success) setNotifications(prev=>prev.filter(n=>n.id!==id));
      }
      router.refresh();
    });
  };

  // Adapting NotificationCore to accept handlers via wrapper UI below core
  return (
    <div className="space-y-4">
      <NotificationCore notifications={notifications as any} />
      <div className="flex gap-2 justify-end">
        <button onClick={()=>handleAction("readAll")} disabled={pending} className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[11px] font-bold text-white hover:bg-white/[0.10] transition-colors">Mark all as read</button>
      </div>
    </div>
  );
}
