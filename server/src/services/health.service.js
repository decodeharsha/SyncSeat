/**
 * =============================================================================
 * services/health.service.js — Health check business logic
 * =============================================================================
 * WHAT THIS FILE DOES:
 *   Encapsulates what "healthy" means for SyncSeat (uptime, version, etc.).
 *   Controllers call services; services do not touch `req`/`res` directly.
 *
 * LAYER: Service (domain/application logic; reusable from HTTP or jobs).
 * =============================================================================
 */

import { config } from "../config/index.js";

/**
 * Build the payload returned by the health endpoint.
 * @param {{ verbose?: boolean }} [options]
 */
export function getHealthStatus(options = {}) {
  const { verbose = false } = options;

  return {
    ok: true,
    app: config.appName,
    environment: config.nodeEnv,
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    ...(verbose ? { pid: process.pid, memory: process.memoryUsage() } : {}),
  };
}
