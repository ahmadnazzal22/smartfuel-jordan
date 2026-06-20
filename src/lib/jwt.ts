const JWT_SECRET = process.env.JWT_SECRET || "mvp-secret-change-in-production";

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

function b64url(input: string): string {
  return btoa(input).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function b64urldecode(input: string): string {
  input = input.replace(/-/g, "+").replace(/_/g, "/");
  while (input.length % 4) input += "=";
  return atob(input);
}

async function hmacSha256(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" },
    false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return b64url(Array.from(new Uint8Array(sig)).map((b) => String.fromCharCode(b)).join(""));
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(b64urldecode(parts[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;

    return { userId: payload.userId, email: payload.email, role: payload.role };
  } catch {
    return null;
  }
}

export async function signTokenTest(payload: JwtPayload): Promise<string> {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64url(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 86400 }));
  const sig = await hmacSha256(`${header}.${body}`, JWT_SECRET);
  return `${header}.${body}.${sig}`;
}
