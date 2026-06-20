import { NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { revokeSession } from "@/lib/auth-server";
import { auditLog } from "@/lib/security/audit";

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const token = getTokenFromRequest(req);
  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      auditLog("LOGOUT", { userId: payload.userId, email: payload.email });
    }
    await revokeSession(token);
  }

  const res = NextResponse.json({ message: "Logged out successfully" });
  res.headers.set("set-cookie", "token=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0");

  return res;
}
