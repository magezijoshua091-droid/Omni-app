import { PrismaClient } from "@prisma/client";

// Ensure DATABASE_URL has a valid format for Prisma validation
const originalDbUrl = process.env.DATABASE_URL;
export const isDbConfigured = !!originalDbUrl && (originalDbUrl.startsWith("postgresql://") || originalDbUrl.startsWith("postgres://"));

if (!isDbConfigured) {
  // Inject dummy URL for Prisma validation to prevent crash
  process.env.DATABASE_URL = "postgresql://postgres:password@localhost:5432/omni?schema=public";
}

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
