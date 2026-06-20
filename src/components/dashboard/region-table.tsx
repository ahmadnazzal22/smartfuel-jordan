"use client";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function RegionTable() {
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/regions").then((r) => r.json()).then((d) => { setRegions(d.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-2.5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex h-9 items-center gap-3" style={{ animationDelay: `${i * 50}ms` }}>
          <div className="h-3 w-24 bg-zinc-800/40 rounded animate-pulse" />
          <div className="h-3 w-12 bg-zinc-800/40 rounded ml-auto animate-pulse" />
          <div className="h-3 w-12 bg-zinc-800/40 rounded animate-pulse" />
          <div className="h-3 w-12 bg-zinc-800/40 rounded animate-pulse" />
          <div className="h-3 w-12 bg-zinc-800/40 rounded animate-pulse" />
          <div className="h-3 w-16 bg-zinc-800/40 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );

  if (regions.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800/40">
            <TableHead className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider py-2.5">Region</TableHead>
            <TableHead className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider text-right py-2.5">Stations</TableHead>
            <TableHead className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider text-right py-2.5">Active</TableHead>
            <TableHead className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider text-right py-2.5">At Risk</TableHead>
            <TableHead className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider text-right py-2.5">Avg Fuel %</TableHead>
            <TableHead className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider py-2.5">Trend</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {regions.map((r, i) => (
            <TableRow key={r.name} className="border-zinc-800/30 animate-fade-in-up opacity-0" style={{ animationDelay: `${i * 40}ms` }}>
              <TableCell className="font-medium text-sm text-zinc-200 py-2.5">{r.name}</TableCell>
              <TableCell className="text-right text-xs text-zinc-400 tabular-nums py-2.5">{r.stations}</TableCell>
              <TableCell className="text-right text-xs text-emerald-400/70 tabular-nums py-2.5">{r.active}</TableCell>
              <TableCell className="text-right text-xs tabular-nums py-2.5">
                {r.at_risk > 0 ? (
                  <span className="inline-flex items-center gap-1 text-rose-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping-soft" />
                    {r.at_risk}
                  </span>
                ) : (
                  <span className="text-zinc-600">{r.at_risk}</span>
                )}
              </TableCell>
              <TableCell className="text-right text-xs tabular-nums py-2.5">
                <span className="text-zinc-300">{r.avg_fuel}%</span>
              </TableCell>
              <TableCell className="py-2.5">
                <span className={`status-tag ${
                  r.trend === "up" ? "status-up" :
                  r.trend === "down" ? "status-down" : "status-flat"
                }`}>
                  {r.trend === "up" ? "↑" : r.trend === "down" ? "↓" : "→"} {r.trend}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
