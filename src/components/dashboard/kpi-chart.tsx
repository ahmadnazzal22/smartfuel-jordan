"use client";
import { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { BarChart3 } from "lucide-react";

export function KpiChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/kpi/history").then((r) => r.json()).then((d) => { setData(d.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[240px] gap-2">
      <div className="h-4 w-4 animate-spin rounded-full border-[1.5px] border-zinc-700 border-t-emerald-400" />
      <span className="text-xs text-zinc-500 font-medium">Loading chart...</span>
    </div>
  );

  if (data.length === 0) return (
    <div className="flex flex-col items-center justify-center h-[240px] text-zinc-600 gap-1.5">
      <BarChart3 className="h-5 w-5 opacity-30" />
      <p className="text-xs font-medium">No KPI history data available</p>
    </div>
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
          <BarChart3 className="h-4 w-4 text-emerald-400" />
        </div>
        <div>
          <h3 className="section-title">KPI Trends</h3>
          <p className="text-[10px] text-zinc-600 mt-0.5">30-day rolling history</p>
        </div>
      </div>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fuelGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="stabilityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="distGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.12)" }} tickFormatter={(v) => v.slice(5)} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "rgba(255,255,255,0.12)" }} axisLine={false} tickLine={false} width={30} />
            <Tooltip
              contentStyle={{
                fontSize: 11, borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(9,9,11,0.9)", backdropFilter: "blur(20px)",
                color: "#fff", boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
              }}
            />
            <Area type="monotone" dataKey="fuel_availability_index" stroke="#10b981" strokeWidth={2} fill="url(#fuelGradient)" dot={false} name="Fuel Avail." />
            <Area type="monotone" dataKey="national_stability_score" stroke="#8b5cf6" strokeWidth={2} fill="url(#stabilityGradient)" dot={false} name="Stability" />
            <Area type="monotone" dataKey="distribution_efficiency" stroke="#f59e0b" strokeWidth={2} fill="url(#distGradient)" dot={false} name="Distribution" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
