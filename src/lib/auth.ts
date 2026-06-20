import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "mvp-secret-change-in-production";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh-secret-change-in-production";

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export function signToken(payload: JwtPayload, expiresIn: string = "1h"): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as any, issuer: "smartfuel-jordan" });
}

export function signRefreshToken(payload: JwtPayload): string {
  const jti = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" as any, issuer: "smartfuel-jordan", jwtid: jti });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET, { issuer: "smartfuel-jordan" }) as JwtPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): (JwtPayload & { jti: string }) | null {
  try {
    return jwt.verify(token, REFRESH_SECRET, { issuer: "smartfuel-jordan" }) as JwtPayload & { jti: string };
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: Request): string | null {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7);
}
