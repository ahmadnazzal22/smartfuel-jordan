import crypto from "crypto";

const TOKEN_LENGTH = 32;
const CSRF_COOKIE = "csrf-token";
const CSRF_HEADER = "x-csrf-token";

function getSecret(): string {
  const secret = process.env.CSRF_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("CSRF_SECRET environment variable is required in production");
  }
  return "dev-csrf-secret-do-not-use-in-production";
}

export function generateToken(): string {
  const secret = getSecret();
  const random = crypto.randomBytes(TOKEN_LENGTH).toString("hex");
  const hmac = crypto.createHmac("sha256", secret).update(random).digest("hex");
  return `${random}.${hmac}`;
}

export function validateToken(token: string): boolean {
  try {
    const secret = getSecret();
    const [random, hmac] = token.split(".");
    if (!random || !hmac) return false;
    const expected = crypto.createHmac("sha256", secret).update(random).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(hmac));
  } catch {
    return false;
  }
}

export function csrfCookieHeader(): { name: string; value: string; options: Record<string, string> } {
  const token = generateToken();
  return {
    name: CSRF_COOKIE,
    value: token,
    options: {
      httpOnly: "true",
      secure: process.env.NODE_ENV === "production" ? "true" : "false",
      sameSite: "strict",
      path: "/",
    },
  };
}

export function validateRequest(request: Request): boolean {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return true;

  const cookie = request.headers.get("cookie") || "";
  const cookieMatch = cookie.match(new RegExp(`${CSRF_COOKIE}=([^;]+)`));
  const cookieToken = cookieMatch ? cookieMatch[1] : null;

  const headerToken = request.headers.get(CSRF_HEADER);

  if (!cookieToken || !headerToken) return false;
  if (cookieToken !== headerToken) return false;

  return validateToken(headerToken);
}

export { CSRF_COOKIE, CSRF_HEADER };
