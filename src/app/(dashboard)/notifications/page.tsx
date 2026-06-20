"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { NotificationItem } from "@/components/notifications/notification-item";
import { Bell, CheckCheck } from "lucide-react";
import { PageSkeleton } from "@/components/ui/dashboard-skeleton";
import type { AlertSeverity, NotificationCategory } from "@/types/notification";

interface Notif {
  id: string; title: string; body: string; severity: AlertSeverity; category: NotificationCategory; is_read: boolean; created_at: string;
}

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = () => {
    fetch("/api/v1/notifications").then((r) => r.json()).then((d) => {
      const mapped = d.data.map((n: any) => ({ ...n, is_read: n.isRead, created_at: n.createdAt }));
      setNotifs(mapped);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchNotifs(); }, []);

  const unread = notifs.filter((n) => !n.is_read).length;

  const markRead = async (id: string) => {
    await fetch("/api/v1/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  const markAllRead = async () => {
    const ids = notifs.filter((n) => !n.is_read).map((n) => n.id);
    await Promise.all(ids.map((id) => fetch("/api/v1/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })));
    setNotifs((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  if (loading) return <PageSkeleton cards={3} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Notifications</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {unread > 0 ? `${unread} unread` : "All caught up"}
          </p>
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="text-xs h-8 gap-1.5">
            <CheckCheck className="h-3.5 w-3.5" /> Mark All Read
          </Button>
        )}
      </div>

      <div className="space-y-2 max-w-2xl">
        {notifs.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-zinc-500">
            <Bell className="h-10 w-10 mb-3 opacity-20" />
            <p className="text-xs">No notifications yet</p>
          </div>
        ) : (
          notifs.map((n) => (
            <NotificationItem key={n.id} notification={n} onMarkRead={markRead} />
          ))
        )}
      </div>
    </div>
  );
}
