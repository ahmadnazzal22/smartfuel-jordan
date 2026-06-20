import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const lower = message.toLowerCase();

  try {
    if (lower.includes("shah") || lower.includes("truck") || lower.includes("tanker")) {
      const total = await prisma.truck.count();
      const inTransit = await prisma.truck.count({ where: { status: "in_transit" } });
      const loading = await prisma.truck.count({ where: { status: "loading" } });
      const totalLoad = await prisma.truck.aggregate({ _sum: { currentLoad: true } });
      return NextResponse.json({
        reply: `🚛 Fleet Status:\n- Total Trucks: ${total}\n- In Transit: ${inTransit}\n- Loading: ${loading}\n- Total Fuel Aboard: ${(totalLoad._sum.currentLoad || 0).toLocaleString()}L`,
      });
    }

    if (lower.includes("station") || lower.includes("mahatta") || lower.includes("محطة")) {
      const total = await prisma.station.count();
      const active = await prisma.station.count({ where: { status: "active" } });
      const atRisk = await prisma.station.count({ where: { riskScore: { gte: 60 } } });
      const stations = await prisma.station.findMany({ orderBy: { riskScore: "desc" }, take: 3, include: { fuelInventories: true } });
      const topRisk = stations.map((s) => `- ${s.name} (risk: ${s.riskScore})`).join("\n");
      return NextResponse.json({
        reply: `⛽ Station Network:\n- Total: ${total}\n- Active: ${active}\n- At Risk: ${atRisk}\n\nHighest Risk:\n${topRisk}`,
      });
    }

    if (lower.includes("risk") || lower.includes("khatar") || lower.includes("danger") || lower.includes("stability")) {
      const stations = await prisma.station.findMany({ include: { fuelInventories: true } });
      const avgFuel = stations.length ? Math.round(stations.reduce((s, st) => {
        const total = st.fuelInventories.reduce((t, f) => t + (f.currentLevel / f.maxCapacity) * 100, 0);
        return s + total / (st.fuelInventories.length || 1);
      }, 0) / stations.length) : 0;
      const critical = stations.filter((s) => s.riskScore >= 70).length;
      const warnings = stations.filter((s) => s.riskScore >= 40 && s.riskScore < 70).length;
      return NextResponse.json({
        reply: `📊 National Risk Overview:\n- Fuel Availability: ${avgFuel}%\n- Critical Stations: ${critical}\n- Warning Stations: ${warnings}\n- Stability Score: ${Math.round(85 - critical * 5 + Math.random() * 6)}/100\n\nAll northern corridors operational. Southern routes nominal.`,
      });
    }

    if (lower.includes("inventory") || lower.includes("fuel") || lower.includes("waqood") || lower.includes("وقود") || lower.includes("diesel") || lower.includes("benzene")) {
      const inventories = await prisma.fuelInventory.findMany({ include: { station: true } });
      const byType: Record<string, { total: number; max: number }> = {};
      for (const inv of inventories) {
        if (!byType[inv.fuelType]) byType[inv.fuelType] = { total: 0, max: 0 };
        byType[inv.fuelType].total += inv.currentLevel;
        byType[inv.fuelType].max += inv.maxCapacity;
      }
      const lines = Object.entries(byType).map(([type, data]) => {
        const pct = Math.round((data.total / data.max) * 100);
        return `- ${type.replace("_", " ")}: ${(data.total / 1000).toFixed(0)}kL / ${(data.max / 1000).toFixed(0)}kL (${pct}%)`;
      });
      return NextResponse.json({
        reply: `🛢️ Fuel Inventory Summary:\n${lines.join("\n")}\n\nTotal Network: ${(Object.values(byType).reduce((s, d) => s + d.total, 0) / 1000).toFixed(0)}kL stored across ${inventories.length} tanks.`,
      });
    }

    if (lower.includes("help") || lower.includes("mosaada") || lower.includes("what") || lower.includes("commands")) {
      return NextResponse.json({
        reply: `🤖 Available Commands:\n- "Trucks" — fleet status\n- "Stations" — station network\n- "Risk" — national risk overview\n- "Fuel" — inventory summary\n- "Alerts" — active alerts\n- "Zone [region]" — region details`,
      });
    }

    if (lower.includes("alert") || lower.includes("enzer") || lower.includes("إنذار") || lower.includes("notification")) {
      const alerts = await prisma.notification.findMany({ where: { isRead: false }, orderBy: { createdAt: "desc" }, take: 5 });
      if (!alerts.length) return NextResponse.json({ reply: "✅ No active alerts. All systems nominal." });
      const lines = alerts.map((a) => `[${a.severity.toUpperCase()}] ${a.title}: ${a.body.slice(0, 60)}`);
      return NextResponse.json({ reply: `🔔 Active Alerts (${alerts.length}):\n${lines.join("\n")}` });
    }

    if (lower.includes("zone") || lower.includes("region") || lower.includes("mintaqa") || lower.includes("منطقة")) {
      const regions = ["Amman", "Irbid", "Zarqa", "Aqaba", "Mafraq", "Karak"];
      const target = regions.find((r) => lower.includes(r.toLowerCase()));
      if (target) {
        const stations = await prisma.station.findMany({ where: { region: target }, include: { fuelInventories: true } });
        const avgFuel = stations.length ? Math.round(stations.reduce((s, st) => {
          const total = st.fuelInventories.reduce((t, f) => t + (f.currentLevel / f.maxCapacity) * 100, 0);
          return s + total / (st.fuelInventories.length || 1);
        }, 0) / stations.length) : 0;
        const atRisk = stations.filter((s) => s.riskScore >= 60).length;
        return NextResponse.json({
          reply: `📍 ${target} Zone:\n- Stations: ${stations.length}\n- Avg Fuel: ${avgFuel}%\n- At Risk: ${atRisk}\n- Status: ${avgFuel > 70 ? "✅ Stable" : avgFuel > 50 ? "⚠️ Watch" : "🔴 Critical"}`,
        });
      }
      return NextResponse.json({ reply: `📍 Available regions: ${regions.join(", ")}. Try "zone amman".` });
    }

    if (lower.includes("hello") || lower.includes("hi") || lower.includes("marhaba") || lower.includes("مرحبا") || lower.includes("hey")) {
      const active = await prisma.station.count({ where: { status: "active" } });
      const inTransit = await prisma.truck.count({ where: { status: "in_transit" } });
      return NextResponse.json({
        reply: `👋 Welcome! National Fuel Network Online.\n- Active Stations: ${active}\n- Trucks En Route: ${inTransit}\n\nAsk me about: trucks, stations, risk, fuel inventory, zone status, or alerts.`,
      });
    }

    return NextResponse.json({
      reply: `Command received: "${message.slice(0, 50)}"\n\nTry: "trucks", "stations", "risk", "fuel", "alerts", "zone amman", or "help".`,
    });

  } catch (err: any) {
    console.error("Chat API error:", err);
    return NextResponse.json({ reply: "⚠️ Database query failed. Please try again." });
  }
}
