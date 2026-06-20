interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

const ONE_MINUTE = 60_000;
const ONE_HOUR = 3_600_000;

function getKey(ip: string, endpoint: string): string {
  return `${ip}:${endpoint}`;
}

function cleanup() {
  const now = Date.now();
  for (const [key, entry] of Array.from(store)) {
    if (entry.resetAt < now) store.delete(key);
  }
}

setInterval(cleanup, ONE_MINUTE);

export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
}

export const limits = {
  auth: { windowMs: ONE_MINUTE, max: 5, message: "Too many login attempts. Try again in 1 minute." },
  authStrict: { windowMs: ONE_HOUR, max: 20, message: "Too many login attempts. Account temporarily locked for 1 hour." },
  api: { windowMs: ONE_MINUTE, max: 60, message: "Too many requests. Slow down." },
  sensitive: { windowMs: ONE_MINUTE, max: 10, message: "Too many sensitive operations. Try again later." },
};

export function checkRateLimit(
  ip: string,
  endpoint: string,
  config: RateLimitConfig = limits.api
): { allowed: boolean; remaining: number; resetAt: number; message?: string } {
  const key = getKey(ip, endpoint);
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true, remaining: config.max - 1, resetAt: now + config.windowMs };
  }

  entry.count += 1;

  if (entry.count > config.max) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
      message: config.message || "Rate limit exceeded",
    };
  }

  return { allowed: true, remaining: config.max - entry.count, resetAt: entry.resetAt };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "127.0.0.1";
}
