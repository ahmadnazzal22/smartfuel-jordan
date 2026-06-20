import "server-only";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "node:path";

const dbUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
const isTurso = dbUrl.startsWith("libsql://");

let resolvedUrl: string;
if (isTurso || dbUrl.startsWith("file:")) {
  resolvedUrl = dbUrl;
} else {
  resolvedUrl = dbUrl;
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter: new PrismaLibSql({ url: resolvedUrl }),
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
