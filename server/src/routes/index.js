/**
 * =============================================================================
 * routes/index.js — Root API router
 * =============================================================================
 * WHAT THIS FILE DOES:
 *   Mounts feature routers under `/api`. As you add events, bookings, users,
 *   import their routers here and `apiRouter.use('/events', eventsRouter)`.
 *
 * LAYER: Routes (composition root for HTTP API surface).
 * =============================================================================
 */

import { Router } from "express";
import { healthRouter } from "./health.routes.js";
import { eventRouter } from "./eventRoutes.js";
import { authRouter } from "./authRoutes.js";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/events", eventRouter);
apiRouter.use("/auth", authRouter);
