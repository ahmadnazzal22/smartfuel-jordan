"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FuelGauge } from "@/components/stations/fuel-gauge";
import { RiskBadge } from "@/components/stations/risk-badge";
import { predictionOutcomeConfig } from "@/lib/constants";
import { MapPin, Phone, Clock } from "lucide-react";
import { PageSkeleton } from "@/components/ui/dashboard-skeleton";

export default function StationDetailPage() {
  const { id } = useParams();
  const [station, setStation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/v1/stations/${id}`).then((r) => { if (!r.ok) throw new Error("Not found"); return r.json(); }).then((d) => { setStation(d.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <PageSkeleton cards={3} />;
  if (!station) return <div className="text-center text-zinc-500 py-12">Station not found</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">{station.name}</h1>
          <p className="text-sm text-zinc-500 flex items-center gap-1 mt-1">
            <MapPin className="h-3 w-3" /> {station.region} · {station.city}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={station.status === "active" ? "success" : "secondary"} className="capitalize text-[11px]">{station.status}</Badge>
          <RiskBadge score={station.riskScore} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader className="pb-2"><CardTitle className="section-title">Fuel Inventory</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {station.fuelInventories?.map((f: any) => (
              <FuelGauge key={f.id} label={f.fuelType.replace("_", " ")} current={f.currentLevel} max={f.maxCapacity} />
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2"><CardTitle className="section-title">Predictions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {(!station.predictions || station.predictions.length === 0) && <p className="text-xs text-zinc-500">No predictions for this station</p>}
            {station.predictions?.map((p: any) => {
              const cfg = predictionOutcomeConfig[p.outcome];
              return (
                <div key={p.id} className="flex items-center justify-between rounded-lg bg-zinc-800/20 border border-zinc-700/30 p-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span>{cfg.icon}</span>
                    <div><span className={`font-medium ${cfg.text}`}>{cfg.label}</span><span className="text-zinc-500 ml-2">{p.predictionDate}</span></div>
                  </div>
                  <span className="text-zinc-500 tabular-nums">{p.confidence}% conf</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-2"><CardTitle className="section-title">Details</CardTitle></CardHeader>
        <CardContent className="grid gap-4 text-sm md:grid-cols-3">
          <div><span className="text-zinc-500 text-xs">License</span><p className="font-medium text-zinc-200">{station.licenseNumber}</p></div>
          <div><span className="text-zinc-500 text-xs">Contact</span><p className="flex items-center gap-1 font-medium text-zinc-200"><Phone className="h-3 w-3 text-zinc-500" />{station.contactPhone || "N/A"}</p></div>
          <div><span className="text-zinc-500 text-xs">Last Maintenance</span><p className="flex items-center gap-1 font-medium text-zinc-200"><Clock className="h-3 w-3 text-zinc-500" />{station.lastMaintenanceAt ? new Date(station.lastMaintenanceAt).toLocaleDateString() : "N/A"}</p></div>
        </CardContent>
      </Card>
    </div>
  );
}
