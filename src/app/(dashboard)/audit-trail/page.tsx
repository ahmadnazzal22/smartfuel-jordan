"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { List, Clock, User, Search } from "lucide-react";
import { formatRelative } from "@/lib/utils";
import { PageSkeleton } from "@/components/ui/dashboard-skeleton";

type AuditEntry = {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: string | null;
  ipAddress: string | null;
  createdAt: string;
  user?: { name: string; email: string } | null;
};

type Meta = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

const actionConfig: Record<string, { color: string }> = {
  create: { color: "text-emerald-400" },
  update: { color: "text-blue-400" },
  delete: { color: "text-rose-400" },
  login: { color: "text-amber-400" },
  logout: { color: "text-zinc-400" },
  export: { color: "text-purple-400" },
  view: { color: "text-zinc-500" },
};

export default function AuditTrailPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState<string>("");
  const [entityFilter, setEntityFilter] = useState<string>("");

  const fetchData = async (p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(p));
      params.set("limit", "20");
      if (actionFilter) params.set("action", actionFilter);
      if (entityFilter) params.set("entity", entityFilter);
      const res = await fetch(`/api/v1/audit-logs?${params}`);
      const json = await res.json();
      setLogs(json.data);
      setMeta(json.meta);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    setPage(1);
    fetchData(1);
  }, [actionFilter, entityFilter]);

  useEffect(() => { fetchData(page); }, [page]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Audit Trail</h1>
        <p className="text-sm text-zinc-500">Complete activity log for all system operations</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-700/30 rounded-lg p-1">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-600 px-2">Action:</span>
          {["", "create", "update", "delete", "login", "export", "view"].map((a) => (
            <button
              key={a}
              onClick={() => setActionFilter(a)}
              className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all ${
                actionFilter === a
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >{a || "All"}</button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-700/30 rounded-lg p-1">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-600 px-2">Entity:</span>
          {["", "Station", "Truck", "User", "Prediction", "Sensor"].map((e) => (
            <button
              key={e}
              onClick={() => setEntityFilter(e.toLowerCase())}
              className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all ${
                entityFilter === e.toLowerCase()
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >{e || "All"}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-700/30">
                <th className="text-left px-4 py-3 text-[9px] font-semibold uppercase tracking-wider text-zinc-600">Action</th>
                <th className="text-left px-4 py-3 text-[9px] font-semibold uppercase tracking-wider text-zinc-600">Entity</th>
                <th className="text-left px-4 py-3 text-[9px] font-semibold uppercase tracking-wider text-zinc-600">Details</th>
                <th className="text-left px-4 py-3 text-[9px] font-semibold uppercase tracking-wider text-zinc-600">User</th>
                <th className="text-left px-4 py-3 text-[9px] font-semibold uppercase tracking-wider text-zinc-600">IP</th>
                <th className="text-right px-4 py-3 text-[9px] font-semibold uppercase tracking-wider text-zinc-600">Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-zinc-800/20">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-3 bg-zinc-800/30 rounded animate-pulse" style={{ width: `${40 + Math.random() * 40}px` }} /></td>
                    ))}
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-zinc-600">
                  <List className="h-6 w-6 mx-auto mb-2 opacity-30" />
                  <p className="text-xs font-medium">No audit logs found</p>
                </td></tr>
              ) : (
                logs.map((log) => {
                  const cfg = actionConfig[log.action] || { color: "text-zinc-500" };
                  return (
                    <tr key={log.id} className="border-b border-zinc-800/20 hover:bg-zinc-800/20 transition-colors">
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${cfg.color}`}>{log.action}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-zinc-300">{log.entity}</span>
                        {log.entityId && <span className="text-zinc-600 ml-1 font-mono text-[9px]">#{log.entityId.slice(0, 8)}</span>}
                      </td>
                      <td className="px-4 py-3 max-w-[240px]">
                        <p className="text-zinc-400 truncate">{log.details || "—"}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-zinc-400">{log.user?.name || log.user?.email || "System"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-zinc-600">{log.ipAddress || "—"}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-zinc-500 font-mono text-[9px]">{formatRelative(log.createdAt)}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-700/30">
            <span className="text-[10px] text-zinc-600">
              Page {meta.page} of {meta.pages} ({meta.total} total)
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg text-[10px] font-semibold bg-zinc-800/40 text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >Previous</button>
              <button
                disabled={page >= meta.pages}
                onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
                className="px-3 py-1.5 rounded-lg text-[10px] font-semibold bg-zinc-800/40 text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
