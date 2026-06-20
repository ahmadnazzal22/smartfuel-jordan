"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TruckStatusBadge } from "@/components/trucks/truck-status-badge";
import { Truck as TruckIcon, Fuel, Gauge } from "lucide-react";
import { PageSkeleton, ListSkeleton } from "@/components/ui/dashboard-skeleton";

export default function TrucksPage() {
  const [trucks, setTrucks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/trucks").then((r) => { if (!r.ok) throw new Error("Failed"); return r.json(); }).then((d) => { setTrucks(d.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <PageSkeleton cards={4} />;

  const enRoute = trucks.filter((t) => t.status === "en_route").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Fleet Management</h1>
        <p className="text-sm text-zinc-500">{trucks.length} trucks · {enRoute} en route</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Trucks", value: trucks.length, icon: <TruckIcon className="h-4 w-4" /> },
          { label: "En Route", value: enRoute, icon: <Fuel className="h-4 w-4 text-blue-500" /> },
          { label: "Loading", value: trucks.filter((t) => t.status === "loading").length, icon: <Gauge className="h-4 w-4 text-amber-500" /> },
          { label: "Idle", value: trucks.filter((t) => t.status === "idle").length, icon: <TruckIcon className="h-4 w-4 text-zinc-500" /> },
        ].map((s) => (
          <Card key={s.label} className="glass-card border-0">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
              {s.icon}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card border-0">
        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">All Trucks</CardTitle></CardHeader>
        <CardContent>
          {/* Desktop table */}
          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800/40">
                  <TableHead className="text-[11px]">Plate</TableHead>
                  <TableHead className="text-[11px]">Driver</TableHead>
                  <TableHead className="text-[11px]">Fuel</TableHead>
                  <TableHead className="text-[11px]">Load</TableHead>
                  <TableHead className="text-[11px]">Status</TableHead>
                  <TableHead className="text-[11px]">Region</TableHead>
                  <TableHead className="text-[11px]">Speed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trucks.map((t) => {
                  const speed = t.gpsLogs?.[0]?.speed;
                  return (
                    <TableRow key={t.id} className="cursor-pointer border-zinc-800/40 hover:bg-zinc-800/30" onClick={() => window.location.href = `/trucks/${t.id}`}>
                      <TableCell className="font-medium text-sm">{t.plateNumber}</TableCell>
                      <TableCell className="text-xs">{t.driverName}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px] border-zinc-700/40">{t.fuelType}</Badge></TableCell>
                      <TableCell className="text-xs tabular-nums">{t.currentLoad.toLocaleString()} / {t.capacity.toLocaleString()}L</TableCell>
                      <TableCell><TruckStatusBadge status={t.status} /></TableCell>
                      <TableCell className="text-xs">{t.region || "-"}</TableCell>
                      <TableCell className="text-xs tabular-nums">{speed != null ? `${speed} km/h` : "-"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {trucks.map((t) => {
              const speed = t.gpsLogs?.[0]?.speed;
              const loadPct = Math.round((t.currentLoad / t.capacity) * 100);
              return (
                <div
                  key={t.id}
                  onClick={() => window.location.href = `/trucks/${t.id}`}
                  className="rounded-xl border border-zinc-600/30 bg-zinc-900/40 p-4 space-y-3 active:bg-zinc-800/40 transition-colors cursor-pointer"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-zinc-200">{t.plateNumber}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{t.driverName}</p>
                    </div>
                    <TruckStatusBadge status={t.status} />
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/40 text-[11px]">
                    <div>
                      <span className="text-zinc-500">Fuel</span>
                      <p className="text-zinc-300 font-medium capitalize">{t.fuelType}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500">Region</span>
                      <p className="text-zinc-300 font-medium">{t.region || "-"}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500">Load</span>
                      <p className="text-zinc-300 font-medium tabular-nums">{t.currentLoad.toLocaleString()} / {t.capacity.toLocaleString()}L</p>
                    </div>
                    <div>
                      <span className="text-zinc-500">Speed</span>
                      <p className="text-zinc-300 font-medium tabular-nums">{speed != null ? `${speed} km/h` : "-"}</p>
                    </div>
                  </div>

                  {/* Load bar */}
                  <div className="h-1 rounded-full bg-zinc-800/60 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${loadPct > 80 ? "bg-emerald-500" : loadPct > 50 ? "bg-amber-500" : "bg-rose-500"}`}
                      style={{ width: `${loadPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
