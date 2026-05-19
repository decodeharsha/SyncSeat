/**
 * =============================================================================
 * validators/health.validator.js — Input validation for health routes
 * =============================================================================
 * WHAT THIS FILE DOES:
 *   Defines Zod schemas for query/body/params for the health feature. Even a
 *   simple GET can grow query flags (e.g. `?deep=1`); keeping schemas here
 *   keeps controllers free of parsing logic.
 *
 * LAYER: Validators (request shape → typed data; throw ZodError on failure).
 * =============================================================================
 */

import { z } from "zod";

/** Optional query params for GET /api/health (extend as the API grows) */
export const healthQuerySchema = z.object({
  /** Example: ?verbose=1 could trigger extra diagnostics later */
  verbose: z
    .enum(["0", "1"])
    .optional()
    .transform((v) => v === "1"),
});
