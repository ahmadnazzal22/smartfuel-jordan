export type AuditAction =
  | "LOGIN_SUCCESS" | "LOGIN_FAILED" | "LOGOUT"
  | "TOKEN_REFRESH" | "TOKEN_REVOKE"
  | "PASSWORD_CHANGE" | "ACCOUNT_LOCKED" | "ACCOUNT_UNLOCKED"
  | "STATION_CREATE" | "STATION_UPDATE" | "STATION_DELETE"
  | "TRUCK_CREATE" | "TRUCK_UPDATE" | "TRUCK_DELETE"
  | "PREDICTION_ACCESS" | "REPORT_GENERATE"
  | "RATE_LIMIT_HIT" | "CSRF_FAILURE"
  | "ROLE_CHANGE" | "USER_CREATE" | "USER_DELETE"
  | "SENSITIVE_ACCESS" | "DATA_EXPORT";

const pending: Array<() => Promise<void>> = [];

if (typeof globalThis !== "undefined") {
  setInterval(() => {
    const batch = pending.splice(0);
    if (batch.length > 0) {
      Promise.allSettled(batch.map((fn) => fn())).catch(() => {});
    }
  }, 2000);
}

export async function auditLog(
  action: AuditAction,
  details: {
    userId?: string;
    email?: string;
    ip?: string;
    userAgent?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<void> {
  if (typeof process === "undefined" || process.env.NEXT_RUNTIME === "edge") {
    return;
  }

  pending.push(async () => {
    try {
      const { prisma } = await import("@/lib/prisma");
      await prisma.auditLog.create({
        data: {
          action,
          userId: details.userId || null,
          entity: details.email || "anonymous",
          details: JSON.stringify({
            severity: action.startsWith("LOGIN_FAILED") || action === "ACCOUNT_LOCKED" || action === "CSRF_FAILURE" ? "critical" : "info",
            email: details.email,
            userAgent: details.userAgent,
            ip: details.ip,
            ...details.metadata,
          }),
          ipAddress: details.ip || "unknown",
        },
      });
    } catch {
      if (process.env.NODE_ENV === "development") {
        console.warn(`[AUDIT] ${action}:`, details.email || details.userId || "anonymous");
      }
    }
  });
}

export async function getFailedLoginCount(email: string, windowMs: number = 900_000): Promise<number> {
  try {
    const { prisma } = await import("@/lib/prisma");
    const since = new Date(Date.now() - windowMs);
    return await prisma.auditLog.count({
      where: {
        action: "LOGIN_FAILED",
        entity: email,
        createdAt: { gte: since },
      },
    });
  } catch {
    return 0;
  }
}
