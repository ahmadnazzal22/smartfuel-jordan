import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await prisma.truck.findUnique({
    where: { id: params.id },
    include: { gpsLogs: { take: 1, orderBy: { timestamp: "desc" } }, trips: { take: 5, orderBy: { createdAt: "desc" } } },
  });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data });
}
