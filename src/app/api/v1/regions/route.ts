import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const stations = await prisma.station.findMany({ include: { fuelInventories: true } });

  const regionMap: Record<string, { stations: number; active: number; fuelPcts: number[] }> = {};
  for (const s of stations) {
    if (!regionMap[s.region]) regionMap[s.region] = { stations: 0, active: 0, fuelPcts: [] };
    regionMap[s.region].stations++;
    if (s.status === "active") regionMap[s.region].active++;
    const pcts = s.fuelInventories.map((f) => (f.currentLevel / f.maxCapacity) * 100);
    regionMap[s.region].fuelPcts.push(...pcts);
  }

  const trends = ["stable", "up", "down"];
  const data = Object.entries(regionMap).map(([name, r]) => {
    const avgFuel = r.fuelPcts.length ? Math.round(r.fuelPcts.reduce((a, b) => a + b, 0) / r.fuelPcts.length) : 0;
    const atRisk = avgFuel < 30 ? 1 : avgFuel < 50 ? Math.ceil((50 - avgFuel) / 10) : 0;
    return { name, stations: r.stations, active: r.active, at_risk: atRisk, avg_fuel: avgFuel, trend: trends[Math.floor(Math.random() * 3)] };
  });

  return NextResponse.json({ data });
}
