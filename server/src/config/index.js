/**
 * =============================================================================
 * config/index.js — Central configuration for SyncSeat
 * =============================================================================
 * WHAT THIS FILE DOES:
 *   Reads environment variables once and exports a small, typed-ish config
 *   object. Controllers and services should use `config` from here instead of
 *   reading `process.env` everywhere (easier to test and reason about).
 *
 * LAYER: Config (no HTTP; used by app bootstrap and services).
 * =============================================================================
 */

/**
 * Parse a comma-separated list of CORS origins from the environment.
 * Falls back to "*" in development if unset (convenient for local frontends).
 */
function parseCorsOrigins(raw) {
  if (!raw || raw.trim() === "") {
    return process.env.NODE_ENV === "production" ? [] : ["*"];
  }
  if (raw.trim() === "*") {
    return true; // cors package accepts `true` / "*" style via origin callback
  }
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

export const config = {
  /** Node environment: development | test | production */
  nodeEnv: process.env.NODE_ENV ?? "development",

  /** HTTP port the API listens on */
  port: Number(process.env.PORT) || 3000,

  /** API display name (logs, health payload) */
  appName: process.env.APP_NAME ?? "SyncSeat API",

  /**
   * CORS allowed origins. In production, set CORS_ORIGIN explicitly
   * (comma-separated). Avoid "*" in production when cookies are involved.
   */
  corsOrigin: process.env.CORS_ORIGIN,

  /** Parsed CORS value for the cors() middleware */
  get corsOriginsParsed() {
    return parseCorsOrigins(this.corsOrigin);
  },
};
