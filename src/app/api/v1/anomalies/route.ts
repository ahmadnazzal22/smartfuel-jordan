import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const severity = searchParams.get("severity");
  const type = searchParams.get("type");

  const where: any = {};
  if (status) where.status = status;
  if (severity) where.severity = severity;
  if (type) where.type = type;

  const data = await prisma.anomaly.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { station: { select: { name: true, region: true } }, truck: { select: { plateNumber: true } } },
  });

  return NextResponse.json({ data, meta: { total: data.length } });
}
