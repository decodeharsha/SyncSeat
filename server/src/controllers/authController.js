/**
 * =============================================================================
 * controllers/authController.js — HTTP handlers for authentication
 * =============================================================================
 * WHAT THIS FILE DOES:
 *   Maps POST /api/auth/register and POST /api/auth/login to authService calls
 *   and returns JSON envelopes. No bcrypt, Prisma, or JWT logic in this file.
 *
 * LAYER: Controller (HTTP adapter; thin).
 * =============================================================================
 */

import {
  registerUser,
  loginUser,
  getUserById,
} from "../services/authService.js";

/**
 * POST /api/auth/register
 * @type {import('express').RequestHandler}
 */
export async function register(req, res) {
  const { name, email, password } = req.body;

  await registerUser({ name, email, password });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
  });
}

/**
 * POST /api/auth/login
 * @type {import('express').RequestHandler}
 */
export async function login(req, res) {
  const { email, password } = req.body;

  const { token, user } = await loginUser({ email, password });

  res.status(200).json({
    success: true,
    token,
    user,
  });
}

/**
 * GET /api/auth/me
 *
 * Uses `req.user.userId` from auth middleware — never trust a client-supplied id
 * in query params or body for "who am I" endpoints.
 *
 * @type {import('express').RequestHandler}
 */
export async function getMe(req, res) {
  const user = await getUserById(req.user.userId);

  res.status(200).json({
    success: true,
    user,
  });
}
