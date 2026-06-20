import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const region = searchParams.get("region");
  const where: any = {};
  if (status) where.status = status;
  if (region) where.region = region;

  const data = await prisma.truck.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: { gpsLogs: { take: 1, orderBy: { timestamp: "desc" } } },
  });
  return NextResponse.json({ data, meta: { total: data.length } });
}
