import { NextResponse } from "next/server";
import { rotateRefreshToken } from "@/lib/auth-server";
import { schemas, validate } from "@/lib/security/validation";
import { getClientIp } from "@/lib/security/rate-limiter";
import { auditLog } from "@/lib/security/audit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { data, error } = validate(schemas.refresh, body);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const ip = getClientIp(req);
  const result = await rotateRefreshToken(data!.refreshToken, ip);

  if (!result) {
    auditLog("TOKEN_REVOKE", { ip, metadata: { reason: "Refresh token rotation failed or invalid" } });
    return NextResponse.json({ error: "Invalid or expired refresh token" }, { status: 401 });
  }

  auditLog("TOKEN_REFRESH", { ip });
  return NextResponse.json(result);
}
