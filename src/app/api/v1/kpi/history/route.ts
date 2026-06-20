import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshots = await prisma.kpiSnapshot.findMany({ orderBy: { date: "asc" }, take: 90 });

  const grouped: Record<string, any> = {};
  for (const s of snapshots) {
    if (!grouped[s.date]) grouped[s.date] = { date: s.date };
    (grouped[s.date] as any)[s.metric] = s.value;
  }

  const data = Object.values(grouped);
  return NextResponse.json({ data, meta: { total: data.length } });
}
