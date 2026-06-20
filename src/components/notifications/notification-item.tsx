"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatRelative } from "@/lib/utils";
import type { Notification } from "@/types/notification";

interface Props {
  notification: Notification;
  onMarkRead?: (id: string) => void;
}

const severityIcon: Record<string, string> = { info: "ℹ️", warning: "⚠️", critical: "🚨", emergency: "🆘" };

export function NotificationItem({ notification: n, onMarkRead }: Props) {
  return (
    <Card
      className={cn(
        "glass-card transition-all duration-200 cursor-pointer hover:bg-zinc-800/40",
        !n.is_read && "border-l-4 border-l-amber-500"
      )}
      onClick={() => !n.is_read && onMarkRead?.(n.id)}
    >
      <CardContent className="flex items-start gap-3 p-3.5">
        <span className="text-lg mt-0.5">{severityIcon[n.severity] || "📢"}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={cn("text-sm", !n.is_read ? "font-semibold text-zinc-100" : "text-zinc-300")}>{n.title}</p>
            {!n.is_read && <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0 animate-live-pulse" />}
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">{n.body}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge variant={n.severity === "critical" ? "danger" : n.severity === "warning" ? "warning" : "default"} className="capitalize text-[10px] px-1.5">
              {n.severity}
            </Badge>
            <span className="text-xs text-zinc-500">{formatRelative(n.created_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
