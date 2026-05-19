/**
 * =============================================================================
 * utils/AppError.js — Operational HTTP errors
 * =============================================================================
 * WHAT THIS FILE DOES:
 *   Defines a small error class for "expected" failures (validation, auth,
 *   not found). The centralized error middleware maps `AppError` to JSON
 *   responses with the right status code.
 *
 * LAYER: Utility (shared by services/controllers; not HTTP-specific).
 *
 * TIP: Throw `new AppError('Event sold out', 409)` from a service; let the
 * error middleware format the response — keeps controllers thin.
 * =============================================================================
 */

export class AppError extends Error {
  /**
   * @param {string} message — Human-readable message (safe for clients if you choose)
   * @param {number} [statusCode=500] — HTTP status code
   */
  constructor(message, statusCode = 500) {
    super(message);
    this.name = "AppError";
    /** HTTP status to send */
    this.statusCode = statusCode;
    /** Marks errors we intentionally throw vs programming bugs */
    this.isOperational = true;
  }
}
