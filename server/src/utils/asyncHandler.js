/**
 * =============================================================================
 * utils/asyncHandler.js — Wrap async Express route handlers
 * =============================================================================
 * WHAT THIS FILE DOES:
 *   Express does not automatically `catch()` rejected Promises in async route
 *   handlers. This wrapper forwards any rejection to `next(err)` so your
 *   centralized error middleware can handle it.
 *
 * LAYER: Utility (used by route handlers / controllers).
 *
 * USAGE:
 *   router.get('/events', asyncHandler(async (req, res) => { ... }));
 * =============================================================================
 */

/**
 * @template {import('express').Request} Req
 * @template {import('express').Response} Res
 * @template {import('express').NextFunction} Next
 * @param {(req: Req, res: Res, next: Next) => unknown} fn
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
