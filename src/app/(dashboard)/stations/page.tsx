"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "@/components/stations/risk-badge";
import { MapPin } from "lucide-react";
import { PageSkeleton } from "@/components/ui/dashboard-skeleton";
import Link from "next/link";

export default function StationsPage() {
  const [stations, setStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/stations").then((r) => { if (!r.ok) throw new Error("Failed"); return r.json(); }).then((d) => { setStations(d.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <PageSkeleton cards={4} />;

  const active = stations.filter((s) => s.status === "active").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Stations</h1>
        <p className="text-sm text-zinc-500">{active} active · {stations.length} total</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stations.filter((s) => s.status === "active").slice(0, 4).map((s) => (
          <Link key={s.id} href={`/stations/${s.id}`}>
            <Card className="glass-card cursor-pointer hover:bg-zinc-800/40 transition-all duration-300 h-full">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-sm">{s.name}</p>
                    <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" />{s.region}</p>
                  </div>
                  <RiskBadge score={s.riskScore} />
                </div>
                {s.fuelInventories?.slice(0, 2).map((f: any) => (
                  <div key={f.id} className="space-y-1">
                    <div className="flex justify-between text-[11px]"><span className="font-medium capitalize">{f.fuelType.replace("_", " ")}</span><span className="text-zinc-500">{f.currentLevel.toLocaleString()}L</span></div>
                    <div className="h-1.5 rounded-full bg-zinc-800/40 overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${(f.currentLevel / f.maxCapacity) < 0.2 ? "from-rose-500 to-rose-400" : (f.currentLevel / f.maxCapacity) < 0.4 ? "from-amber-500 to-amber-400" : "from-emerald-500 to-emerald-400"}`} style={{ width: `${(f.currentLevel / f.maxCapacity) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="glass-card border-0">
        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">All Stations</CardTitle></CardHeader>
        <CardContent>
          {/* Desktop table — hidden on mobile */}
          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800/40">
                  <TableHead className="text-[11px]">Name</TableHead>
                  <TableHead className="text-[11px]">Region</TableHead>
                  <TableHead className="text-[11px]">Status</TableHead>
                  <TableHead className="text-[11px]">Risk</TableHead>
                  <TableHead className="text-[11px]">Diesel</TableHead>
                  <TableHead className="text-[11px]">Octane 90</TableHead>
                  <TableHead className="text-[11px]">Octane 95</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stations.map((s) => {
                  const getFuel = (type: string) => s.fuelInventories?.find((f: any) => f.fuelType === type);
                  return (
                    <TableRow key={s.id} className="cursor-pointer border-zinc-800/40 hover:bg-zinc-800/30" onClick={() => window.location.href = `/stations/${s.id}`}>
                      <TableCell className="font-medium text-sm">{s.name}</TableCell>
                      <TableCell className="text-xs">{s.region}</TableCell>
                      <TableCell><Badge variant={s.status === "active" ? "success" : s.status === "maintenance" ? "warning" : "secondary"} className="text-[10px]">{s.status}</Badge></TableCell>
                      <TableCell><RiskBadge score={s.riskScore} /></TableCell>
                      <TableCell className="text-xs tabular-nums">{getFuel("diesel")?.currentLevel?.toLocaleString() || 0}L</TableCell>
                      <TableCell className="text-xs tabular-nums">{getFuel("octane_90")?.currentLevel?.toLocaleString() || 0}L</TableCell>
                      <TableCell className="text-xs tabular-nums">{getFuel("octane_95")?.currentLevel?.toLocaleString() || 0}L</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards — shown only on small screens */}
          <div className="sm:hidden space-y-3">
            {stations.map((s) => {
              const getFuel = (type: string) => s.fuelInventories?.find((f: any) => f.fuelType === type);
              return (
                <div
                  key={s.id}
                  onClick={() => window.location.href = `/stations/${s.id}`}
                  className="rounded-xl border border-zinc-600/30 bg-zinc-900/40 p-4 space-y-3 active:bg-zinc-800/40 transition-colors cursor-pointer"
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-zinc-200">{s.name}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{s.region}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={s.status === "active" ? "success" : s.status === "maintenance" ? "warning" : "secondary"} className="text-[9px]">{s.status}</Badge>
                      <RiskBadge score={s.riskScore} />
                    </div>
                  </div>

                  {/* Fuel levels */}
                  <div className="space-y-2 pt-2 border-t border-zinc-800/40">
                    {["diesel", "octane_90", "octane_95"].map((type) => {
                      const f = getFuel(type);
                      if (!f) return null;
                      const pct = (f.currentLevel / f.maxCapacity) * 100;
                      return (
                        <div key={type} className="flex items-center justify-between text-[11px]">
                          <span className="capitalize text-zinc-400">{type.replace(/_/g, " ")}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-300 font-medium tabular-nums">{f.currentLevel.toLocaleString()}L</span>
                            <div className="w-16 h-1.5 rounded-full bg-zinc-800/60 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${pct < 20 ? "bg-rose-500" : pct < 40 ? "bg-amber-500" : "bg-emerald-500"}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
