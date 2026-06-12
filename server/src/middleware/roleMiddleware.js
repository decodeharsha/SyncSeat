/**
 * =============================================================================
 * middleware/roleMiddleware.js — Role-based authorization
 * =============================================================================
 * AUTHENTICATION VS AUTHORIZATION
 * -------------------------------
 * Authentication (`authenticate`) answers "who is this?" — it verifies the JWT.
 * Authorization (`requireAdmin`) answers "what may they do?" — it checks the
 * user's role after identity is known.
 *
 * ROLE-BASED ACCESS CONTROL (RBAC)
 * --------------------------------
 * Roles group permissions. SyncSeat uses `USER` (browse) and `ADMIN` (manage
 * events). Middleware reads `req.user.role` from the decoded JWT payload and
 * blocks non-admins before controllers or services run.
 *
 * ADMIN-ONLY ACTIONS
 * ------------------
 * Creating, updating, and deleting events mutate shared data. Only `ADMIN`
 * may perform those operations; everyone else receives 403 Forbidden.
 *
 * LAYER: Middleware (HTTP cross-cutting concern).
 * =============================================================================
 */

import { AppError } from "../utils/AppError.js";

/**
 * Allow the request only when `req.user.role` is `"ADMIN"`.
 * Run after `authenticate` so `req.user` is populated from the JWT.
 *
 * @type {import('express').RequestHandler}
 */
export function requireAdmin(req, res, next) {
  if (!req.user) {
    return next(new AppError("Unauthorized", 401));
  }

  if (req.user.role !== "ADMIN") {
    return next(new AppError("Forbidden", 403));
  }

  next();
}
