/**
 * =============================================================================
 * config/prisma.js — Shared Prisma client instance
 * =============================================================================
 * WHAT THIS FILE DOES:
 *   Creates one PrismaClient for the whole app. Import `prisma` from here in
 *   services (not in controllers) so connection pooling and config stay centralized.
 *
 * LAYER: Config / infrastructure.
 * =============================================================================
 */

import { PrismaClient } from "@prisma/client";

/** Singleton — avoids opening many DB connections during hot reload in dev */
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
