/**
 * =============================================================================
 * routes/health.routes.js — Health route definitions
 * =============================================================================
 * WHAT THIS FILE DOES:
 *   Declares URL paths and HTTP verbs, wires them to controller functions.
 *   Routers stay small; they should not contain business logic.
 *
 * LAYER: Routes (URL ↔ controller mapping).
 * =============================================================================
 */

import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { healthCheck } from "../controllers/health.controller.js";

export const healthRouter = Router();

healthRouter.get("/", asyncHandler(healthCheck));
