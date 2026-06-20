import "server-only";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const isVercel = process.env.VERCEL === "1";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createClient() {
  if (isVercel) {
    return new PrismaClient({
      datasources: { db: { url: process.env.DATABASE_URL! } },
    });
  }
  return new PrismaClient({
    adapter: new PrismaLibSql({ url: process.env.DATABASE_URL || "file:./prisma/dev.db" }),
  });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
