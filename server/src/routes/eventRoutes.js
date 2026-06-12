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
import { authenticate } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

export const eventRouter = Router();

/** List all events — public read */
eventRouter.get("/", asyncHandler(getAllEvents));

/** Create a new event — admin only */
eventRouter.post("/", authenticate, requireAdmin, asyncHandler(createEvent));

/** Get one event by id — public read; define after `/` so list is not shadowed */
eventRouter.get("/:id", asyncHandler(getEventById));

/** Update one event by id — admin only */
eventRouter.put(
  "/:id",
  authenticate,
  requireAdmin,
  asyncHandler(updateEvent),
);

/** Delete one event by id — admin only */
eventRouter.delete(
  "/:id",
  authenticate,
  requireAdmin,
  asyncHandler(deleteEvent),
);
