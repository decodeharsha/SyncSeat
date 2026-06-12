/**
 * =============================================================================
 * routes/authRoutes.js — Authentication route definitions
 * =============================================================================
 * WHAT THIS FILE DOES:
 *   Declares `/register` and `/login` under the `/api/auth` mount in
 *   `routes/index.js`. Routers map URLs to controllers only — no business logic.
 *
 * LAYER: Routes (URL ↔ controller mapping).
 * =============================================================================
 */

import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { getMe, login, register } from "../controllers/authController.js";

export const authRouter = Router();

/** Create a new user account */
authRouter.post("/register", asyncHandler(register));

/** Authenticate and receive a JWT */
authRouter.post("/login", asyncHandler(login));

/** Return the currently authenticated user (JWT required) */
authRouter.get("/me", authenticate, asyncHandler(getMe));
