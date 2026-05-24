/**
 * =============================================================================
 * routes/eventRoutes.js — Event route definitions
 * =============================================================================
 * WHAT THIS FILE DOES:
 *   Declares event URLs and wires them to controllers. Mounted at `/events`
 *   in `routes/index.js`, so `GET /` here becomes `GET /api/events`.
 *
 * LAYER: Routes (URL ↔ controller mapping).
 * =============================================================================
 */

import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getAllEvents, createEvent } from "../controllers/eventController.js";

export const eventRouter = Router();

/** List all events */
eventRouter.get("/", asyncHandler(getAllEvents));

/** Create a new event */
eventRouter.post("/", asyncHandler(createEvent));
