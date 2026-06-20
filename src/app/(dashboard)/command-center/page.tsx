"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { PageSkeleton } from "@/components/ui/dashboard-skeleton";
import { ExportBar } from "@/components/dashboard/export-bar";
import {
  Shield, Activity, AlertTriangle, Truck, Gauge, Droplets,
  Zap, Globe, Bell, Terminal, Radio, Satellite, MapPin, Clock,
  BarChart3, Fuel, Bot,
} from "lucide-react";

export default function CommandCenterPage() {
  const [kpi, setKpi] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/v1/dashboard").then((r) => r.json()),
      fetch("/api/v1/predictions").then((r) => r.json()),
      fetch("/api/v1/notifications").then((r) => r.json()),
    ]).then(([dash, preds, notifs]) => {
      setKpi({ ...dash.data, preds: preds.data, notifs: notifs.data });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <PageSkeleton cards={6} />;

  const statusItems = [
    { label: "Network Status", value: kpi?.national_stability_score ?? 0, unit: "%", icon: Shield, color: "text-emerald-400", desc: "National Fuel Grid" },
    { label: "Active Stations", value: kpi?.total_active_stations ?? 0, unit: "", icon: MapPin, color: "text-blue-400", desc: "Online & Reporting" },
    { label: "Trucks En Route", value: kpi?.total_trucks_en_route ?? 0, unit: "", icon: Truck, color: "text-amber-400", desc: "In Transit" },
    { label: "Stations at Risk", value: kpi?.stations_at_risk ?? 0, unit: "", icon: AlertTriangle, color: "text-rose-400", desc: "Requires Attention" },
    { label: "Distribution", value: kpi?.distribution_efficiency ?? 0, unit: "%", icon: Activity, color: "text-emerald-400", desc: "Delivery Efficiency" },
    { label: "Fraud Detection", value: kpi?.fraud_detection_score ?? 0, unit: "%", icon: Gauge, color: "text-purple-400", desc: "Anomaly Coverage" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20">
              <Radio className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Command Center</h1>
              <p className="text-sm text-zinc-500">National Fuel Network — Centralized Command & Control</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-emerald-500/10 rounded-full px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-pulse" />
            <span className="text-[8px] text-emerald-400 font-mono font-bold tracking-wider">ALL SYSTEMS</span>
          </div>
          <ExportBar title="Command Center - SmartFuel Jordan" csvData={{ filename: "command-center", headers: ["Metric", "Value"], rows: statusItems.map((s) => [s.label, `${s.value}${s.unit}`]) }} />
        </div>
      </div>

      {/* Top Status Bar */}
      <div className="grid grid-cols-12 gap-3">
        {statusItems.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="col-span-6 lg:col-span-2"
          >
            <Card className="glass-card">
              <CardContent className="p-3 text-center">
                <item.icon className={`h-5 w-5 ${item.color} mx-auto mb-1`} />
                <p className={`text-xl font-mono font-bold ${item.color}`}>{item.value}{item.unit}</p>
                <p className="text-[8px] text-zinc-500 uppercase tracking-wider font-medium mt-0.5">{item.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Command Grid */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-4">
          <div className="glass-panel p-4 h-full">
            <h3 className="text-xs font-semibold text-zinc-200 mb-3 flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              Emergency Commands
            </h3>
            <div className="space-y-2">
              {[
                { label: "Activate Reserve Release", desc: "Release strategic fuel reserves", color: "rose" },
                { label: "Emergency Reroute", desc: "Reroute all available tankers", color: "amber" },
                { label: "Lockdown Station", desc: "Isolate station from network", color: "rose" },
                { label: "Escalate to Minister", desc: "Send briefing to cabinet", color: "amber" },
              ].map((cmd) => (
                <button key={cmd.label} className={`w-full text-left glass-inset hover:bg-${cmd.color}-500/5 transition-all`}>
                  <p className="text-xs font-semibold text-zinc-200">{cmd.label}</p>
                  <p className="text-[8px] text-zinc-500">{cmd.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="glass-panel p-4 h-full">
            <h3 className="text-xs font-semibold text-zinc-200 mb-3 flex items-center gap-2">
              <Satellite className="h-3.5 w-3.5 text-blue-400" />
              System Intelligence
            </h3>
            <div className="space-y-2">
              {[
                { label: "Run Predictive Scan", icon: BarChart3, desc: "AI-driven 72h forecast" },
                { label: "Supply Chain Audit", icon: Truck, desc: "End-to-end logistics check" },
                { label: "Risk Assessment", icon: Shield, desc: "Full national risk profile" },
                { label: "Generate Report", icon: Terminal, desc: "Executive summary for cabinet" },
              ].map((cmd) => (
                <button key={cmd.label} className="w-full text-left glass-inset hover:bg-emerald-500/5 transition-all">
                  <div className="flex items-center gap-2">
                    <cmd.icon className="h-3 w-3 text-zinc-400" />
                    <div>
                      <p className="text-xs font-semibold text-zinc-200">{cmd.label}</p>
                      <p className="text-[8px] text-zinc-500">{cmd.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="glass-panel p-4 h-full">
            <h3 className="text-xs font-semibold text-zinc-200 mb-3 flex items-center gap-2">
              <Bell className="h-3.5 w-3.5 text-rose-400" />
              Active Alerts ({kpi?.notifs?.length || 0})
            </h3>
            <div className="space-y-2">
              {(kpi?.notifs?.slice(0, 4) || []).map((n: any) => (
                <div key={n.id} className="glass-inset flex items-start gap-2">
                  <span className={`w-0.5 self-stretch rounded-full ${n.severity === "critical" ? "bg-rose-500" : "bg-amber-500"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-zinc-200 truncate">{n.title}</p>
                    <p className="text-[8px] text-zinc-500 line-clamp-1">{n.body}</p>
                  </div>
                </div>
              ))}
              {(!kpi?.notifs || kpi.notifs.length === 0) && (
                <div className="flex flex-col items-center justify-center py-6 text-zinc-600">
                  <Shield className="h-6 w-6 opacity-30 mb-1" />
                  <p className="text-[10px] font-medium">All clear — no active alerts</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* System Log */}
      <div className="glass-panel p-4">
        <div className="flex items-center gap-2 mb-3">
          <Terminal className="h-3.5 w-3.5 text-emerald-400" />
          <h3 className="text-xs font-semibold text-zinc-200">System Command Log</h3>
          <span className="text-[8px] text-zinc-600 font-mono">Last 5 events</span>
        </div>
        <div className="space-y-1.5 font-mono">
          {[
            { time: "14:32:01", event: "DASHBOARD_SYNC", status: "OK" },
            { time: "14:31:45", event: "PREDICTIONS_UPDATE", status: "OK" },
            { time: "14:30:00", event: "SENSOR_POLL_247", status: "OK" },
            { time: "14:29:12", event: "GPS_PING_5_TRUCKS", status: "OK" },
            { time: "14:28:30", event: "ALERT_SCAN", status: "CLEAN" },
          ].map((log) => (
            <div key={log.time} className="flex items-center gap-3 text-[9px]">
              <span className="text-zinc-600 w-16">{log.time}</span>
              <span className="text-zinc-400 flex-1">{log.event}</span>
              <span className="text-emerald-400/80 font-semibold">{log.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
