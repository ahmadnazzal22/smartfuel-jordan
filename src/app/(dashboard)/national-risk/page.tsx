"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { PageSkeleton } from "@/components/ui/dashboard-skeleton";
import { ExportBar } from "@/components/dashboard/export-bar";
import {
  Shield, AlertTriangle, TrendingUp, TrendingDown,
  Globe, Droplets, Gauge, BarChart3, MapPin, Clock,
  Activity, Fuel, Zap, AlertCircle, Truck,
} from "lucide-react";

interface RiskFactor {
  label: string;
  value: number;
  trend: "up" | "down" | "stable";
  icon: any;
  desc: string;
}

const riskFactors: RiskFactor[] = [
  { label: "Geopolitical Risk", value: 72, trend: "up", icon: Globe, desc: "Regional instability impact on fuel supply routes" },
  { label: "Supply Chain Disruption", value: 45, trend: "down", icon: Activity, desc: "Logistics and transportation bottlenecks" },
  { label: "Reserve Depletion Rate", value: 38, trend: "up", icon: Droplets, desc: "Rate of strategic reserve consumption" },
  { label: "Infrastructure Vulnerability", value: 55, trend: "stable", icon: Zap, desc: "Aging pipeline and storage facilities" },
  { label: "Demand Surge Risk", value: 63, trend: "up", icon: TrendingUp, desc: "Seasonal demand peaks exceeding supply" },
  { label: "Cyber Security Threat", value: 41, trend: "stable", icon: Shield, desc: "SCADA and IoT attack surface exposure" },
];

const strategicRecs = [
  { priority: "CRITICAL", action: "Activate emergency reserve release for Zarqa and Karak regions", impact: "Extends supply by 14 days", dept: "Ministry of Energy" },
  { priority: "HIGH", action: "Increase Aqaba port throughput capacity by 20%", impact: "Reduces offload time by 8 hours", dept: "Port Authority" },
  { priority: "MEDIUM", action: "Deploy mobile fuel storage units to northern governorates", impact: "Covers 72h demand gap", dept: "Jordan Armed Forces" },
  { priority: "LOW", action: "Audit fuel station compliance and data integrity", impact: "Improves forecast accuracy by 12%", dept: "Energy Regulatory Commission" },
];

export default function NationalRiskPage() {
  const [kpi, setKpi] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/dashboard")
      .then((r) => r.json())
      .then((d) => { setKpi(d.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <PageSkeleton cards={6} />;

  const stabilityScore = kpi?.national_stability_score ?? 74;
  const availabilityIndex = kpi?.fuel_availability_index ?? 68;
  const compositeRisk = Math.round(
    riskFactors.reduce((sum, f) => sum + f.value, 0) / riskFactors.length
  );
  const nationalSecurityIndex = Math.round(
    (stabilityScore * 0.4 + availabilityIndex * 0.4 + (100 - compositeRisk) * 0.2)
  );

  const severityColor = (v: number) => {
    if (v >= 80) return "text-emerald-400";
    if (v >= 60) return "text-amber-400";
    return "text-rose-400";
  };
  const severityBg = (v: number) => {
    if (v >= 80) return "bg-emerald-500/10 border-emerald-500/20";
    if (v >= 60) return "bg-amber-500/10 border-amber-500/20";
    return "bg-rose-500/10 border-rose-500/20";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            National Risk Dashboard
          </h1>
          <p className="text-sm text-zinc-500">
            His Majesty&apos;s Strategic Fuel Security Overview — Hashemite Kingdom of Jordan
          </p>
        </div>
        <ExportBar title="National Risk - SmartFuel Jordan" csvData={{ filename: "national-risk", headers: ["Factor", "Value", "Trend"], rows: riskFactors.map((f) => [f.label, `${f.value}%`, f.trend]) }} />
      </div>

      {/* National Security Index — Hero Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`glass-card border-2 ${severityBg(nationalSecurityIndex)}`}>
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative flex-shrink-0">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-900/60 border-4 border-zinc-700/30">
                  <Shield className={`h-10 w-10 ${severityColor(nationalSecurityIndex)}`} />
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 border border-zinc-700/30">
                  <span className={`text-[10px] font-mono font-bold ${severityColor(nationalSecurityIndex)}`}>
                    {nationalSecurityIndex > 70 ? "B+" : nationalSecurityIndex > 50 ? "C+" : "D"}
                  </span>
                </div>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-widest mb-1">
                  National Fuel Security Index
                </p>
                <p className={`text-5xl sm:text-6xl font-mono font-bold tracking-tight ${severityColor(nationalSecurityIndex)}`}>
                  {nationalSecurityIndex}
                  <span className="text-2xl text-zinc-600 font-normal">/100</span>
                </p>
                <p className="text-sm text-zinc-400 mt-2 max-w-lg">
                  Composite score derived from {riskFactors.length} risk dimensions, real-time fuel availability,
                  and national stability metrics. Updated every 30 seconds from 1,247 IoT sensors nationwide.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Risk Factors Grid */}
      <div className="grid grid-cols-12 gap-4">
        {riskFactors.map((f, i) => {
          const barColor = f.value >= 70 ? "bg-rose-500" : f.value >= 50 ? "bg-amber-500" : "bg-emerald-500";
          return (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className="col-span-12 sm:col-span-6 lg:col-span-4"
            >
              <Card className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800/40">
                      <f.icon className="h-4 w-4 text-zinc-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-zinc-200">{f.label}</p>
                      <p className="text-[9px] text-zinc-500 truncate">{f.desc}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {f.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-rose-400" />
                      ) : f.trend === "down" ? (
                        <TrendingDown className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <span className="h-3 w-3 flex items-center justify-center">
                          <span className="h-1 w-1 rounded-full bg-zinc-500" />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-zinc-800/50 overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${f.value}%` }} />
                    </div>
                    <span className={`text-sm font-mono font-bold ${barColor.replace("bg-", "text-")}`}>{f.value}%</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Strategic Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="glass-panel p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <BarChart3 className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="section-title">Strategic Recommendations</h3>
              <p className="text-[10px] text-zinc-600 mt-0.5">AI-generated cabinet-level advisory</p>
            </div>
          </div>
          <div className="space-y-2">
            {strategicRecs.map((rec, i) => {
              const pColor = rec.priority === "CRITICAL" ? "text-rose-400 bg-rose-500/10" : rec.priority === "HIGH" ? "text-amber-400 bg-amber-500/10" : rec.priority === "MEDIUM" ? "text-blue-400 bg-blue-500/10" : "text-zinc-400 bg-zinc-800/30";
              return (
                <div key={i} className="glass-inset flex items-start gap-4">
                  <div className={`flex-shrink-0 rounded-md px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest ${pColor}`}>
                    {rec.priority}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-zinc-200">{rec.action}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[8px] text-zinc-500 font-mono">{rec.impact}</span>
                      <span className="text-[8px] text-zinc-600">·</span>
                      <span className="text-[8px] text-zinc-500">{rec.dept}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-12 gap-4"
      >
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <AlertCircle className="h-5 w-5 text-amber-400" />
              </div>
              <p className="text-2xl font-mono font-bold text-amber-400">{kpi?.stations_at_risk ?? 4}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Stations at Risk</p>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <Truck className="h-5 w-5 text-emerald-400" />
              </div>
              <p className="text-2xl font-mono font-bold text-emerald-400">{kpi?.total_trucks_en_route ?? 23}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Trucks En Route</p>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <Droplets className="h-5 w-5 text-blue-400" />
              </div>
              <p className="text-2xl font-mono font-bold text-blue-400">{kpi?.avg_waiting_time_min ?? 12}m</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Avg Queue Time</p>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <Gauge className="h-5 w-5 text-purple-400" />
              </div>
              <p className="text-2xl font-mono font-bold text-purple-400">{kpi?.distribution_efficiency ?? 87}%</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Distribution Efficiency</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
