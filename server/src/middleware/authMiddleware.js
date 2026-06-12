/**
 * =============================================================================
 * middleware/authMiddleware.js — JWT authorization for protected routes
 * =============================================================================
 * WHAT THIS FILE DOES:
 *   Reads the `Authorization` header, verifies the Bearer JWT, and attaches the
 *   decoded payload to `req.user` so downstream handlers know who is calling.
 *
 * AUTHORIZATION HEADER
 * --------------------
 * Clients send `Authorization: Bearer <token>`. "Bearer" is the scheme name;
 * the token string is the JWT returned from POST /api/auth/login.
 *
 * BEARER TOKENS
 * -------------
 * A Bearer token means "whoever holds this token may access the resource."
 * The server does not use cookies here — the client stores the JWT and sends it
 * on each protected request in the Authorization header.
 *
 * JWT VERIFICATION
 * ----------------
 * `jwt.verify(token, secret)` checks the signature and expiry using
 * `process.env.JWT_SECRET` (set in `.env`). If valid, it returns the payload
 * (`userId`, `email`, `role`) that was embedded at login time.
 *
 * req.user
 * --------
 * After verification, `req.user` holds that decoded payload. Controllers and
 * services read `req.user.userId` instead of trusting ids from the request body.
 *
 * WHY MIDDLEWARE IS USEFUL
 * ------------------------
 * Auth checks run once in a reusable function. Any route can add `authenticate`
 * without duplicating header parsing, verification, and 401 responses.
 *
 * LAYER: Middleware (HTTP cross-cutting concern).
 * =============================================================================
 */

import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

/**
 * Require a valid JWT before the route handler runs.
 * @type {import('express').RequestHandler}
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401));
  }

  const token = authHeader.slice("Bearer ".length).trim();

  if (!token) {
    return next(new AppError("Unauthorized", 401));
  }

  const secret = process.env.JWT_SECRET;
  if (!secret?.trim()) {
    return next(new AppError("JWT_SECRET is not configured", 500));
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch {
    next(new AppError("Unauthorized", 401));
  }
}
