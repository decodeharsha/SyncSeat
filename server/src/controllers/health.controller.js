/**
 * =============================================================================
 * controllers/health.controller.js — HTTP handlers for health
 * =============================================================================
 * WHAT THIS FILE DOES:
 *   Translates HTTP (query params, status codes) into service calls and JSON
 *   responses. Keep this file thin: validate → call service → send response.
 *
 * LAYER: Controller (HTTP adapter; no heavy business rules).
 * =============================================================================
 */

import { getHealthStatus } from "../services/health.service.js";
import { healthQuerySchema } from "../validators/health.validator.js";

/**
 * GET /api/health
 * Async so Zod validation errors become Promise rejections caught by asyncHandler.
 * @type {import('express').RequestHandler}
 */
export async function healthCheck(req, res) {
  const query = healthQuerySchema.parse(req.query);
  const payload = getHealthStatus({ verbose: query.verbose });
  res.status(200).json({ success: true, data: payload });
}
