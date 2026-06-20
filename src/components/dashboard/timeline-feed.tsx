"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Clock, Truck, AlertTriangle, Fuel, User,
  Settings, LogIn, Activity, RefreshCw,
} from "lucide-react";
import { formatRelative } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  action: string;
  entity: string;
  details: string | null;
  createdAt: string;
  icon: any;
  color: string;
  user?: { name: string } | null;
}

const actionIconMap: Record<string, { icon: any; color: string }> = {
  login: { icon: LogIn, color: "bg-emerald-500/15 text-emerald-400" },
  update: { icon: Settings, color: "bg-blue-500/15 text-blue-400" },
  create: { icon: Activity, color: "bg-emerald-500/15 text-emerald-400" },
  delete: { icon: AlertTriangle, color: "bg-rose-500/15 text-rose-400" },
  export: { icon: Truck, color: "bg-amber-500/15 text-amber-400" },
  view: { icon: Fuel, color: "bg-zinc-500/15 text-zinc-400" },
};

export function TimelineFeed() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/v1/audit-logs?limit=8");
      const json = await res.json();
      const mapped: TimelineEvent[] = (json.data || []).map((log: any) => {
        const iconCfg = actionIconMap[log.action] || { icon: Activity, color: "bg-zinc-500/15 text-zinc-400" };
        return {
          id: log.id,
          action: log.action,
          entity: log.entity,
          details: log.details,
          createdAt: log.createdAt,
          icon: iconCfg.icon,
          color: iconCfg.color,
          user: log.user,
        };
      });
      setEvents(mapped);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-500/10">
            <Clock className="h-4 w-4 text-zinc-400" />
          </div>
          <div>
            <h3 className="section-title">Activity Timeline</h3>
            <p className="text-[10px] text-zinc-600 mt-0.5">Recent system events</p>
          </div>
        </div>
        <button
          onClick={fetchEvents}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800/40 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-all"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="relative">
        {loading ? (
          <div className="space-y-4 pl-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="skeleton-premium h-6 w-6 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="skeleton-premium h-3 w-40" />
                  <div className="skeleton-premium h-2 w-64" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-zinc-600 gap-2">
            <Clock className="h-6 w-6 opacity-30" />
            <p className="text-xs font-medium">No activity recorded</p>
          </div>
        ) : (
          events.map((event, i) => {
            const Icon = event.icon;
            return (
              <motion.div
                key={event.id}
                className="timeline-node"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
              >
                <div className={`timeline-dot ${event.color}`}>
                  <Icon className="h-3 w-3" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-semibold text-zinc-200 capitalize">{event.action}</span>
                    <span className="text-[8px] text-zinc-600 font-mono">{formatRelative(event.createdAt)}</span>
                    {event.user?.name && (
                      <span className="text-[8px] text-zinc-600">by {event.user.name}</span>
                    )}
                  </div>
                  <p className="text-[9px] text-zinc-500 leading-relaxed">{event.details || `${event.action} ${event.entity}`}</p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
