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
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

export const eventRouter = Router();

/** List all events */
eventRouter.get("/", asyncHandler(getAllEvents));

/** Create a new event */
eventRouter.post("/", asyncHandler(createEvent));

/** Get one event by id — define after `/` so the list route is not shadowed */
eventRouter.get("/:id", asyncHandler(getEventById));

/** Update one event by id */
eventRouter.put("/:id", asyncHandler(updateEvent));

/** Delete one event by id */
eventRouter.delete("/:id", asyncHandler(deleteEvent));
