/**
 * =============================================================================
 * middleware/notFound.js — 404 handler for unknown routes
 * =============================================================================
 * WHAT THIS FILE DOES:
 *   When no route matches the request path, this middleware sends a JSON 404.
 *   Place it AFTER all `app.use('/api', ...)` route mounts but BEFORE the
 *   error handler (which only runs when `next(err)` is called).
 *
 * LAYER: Middleware (HTTP).
 * =============================================================================
 */

/**
 * @type {import('express').RequestHandler}
 */
export function notFound(req, res) {
  res.status(404).json({
    success: false,
    error: {
      message: `Cannot ${req.method} ${req.originalUrl}`,
    },
  });
}
