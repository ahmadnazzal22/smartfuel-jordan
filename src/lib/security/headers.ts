import type { NextResponse } from "next/server";

export const securityHeaders: Record<string, string> = {
  "x-dns-prefetch-control": "off",
  "x-frame-options": "DENY",
  "x-content-type-options": "nosniff",
  "x-permitted-cross-domain-policies": "none",
  "x-xss-protection": "0",
  "referrer-policy": "strict-origin-when-cross-origin",
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-resource-policy": "same-origin",
  "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
};

export function applySecurityHeaders(response: NextResponse): void {
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }

  // CSP is intentionally excluded from middleware — it's too aggressive for
  // Next.js dev (requires 'unsafe-eval' for HMR) and needs per-page tuning.
  // Enable it in next.config.js via headers() for production routes only.
}
