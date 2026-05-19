/**
 * =============================================================================
 * app.js — Express application factory (HTTP middleware + routes)
 * =============================================================================
 * WHAT THIS FILE DOES:
 *   Builds the Express `app` with global middleware and API routes. It does
 *   NOT call `listen()` — that lives in `server.js` so you can attach Socket.IO
 *   to the underlying HTTP server and reuse `app` in tests.
 *
 * LAYER: Application composition (wires config, middleware, routes).
 * =============================================================================
 */

import express from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config/index.js";
import { apiRouter } from "./routes/index.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

export function createApp() {
  const app = express();

  // Trust reverse proxy (Render, Heroku, nginx) for correct client IPs when needed
  app.set("trust proxy", 1);

  // --- Cross-origin browser requests ---
  app.use(
    cors({
      origin: (origin, callback) => {
        const allowed = config.corsOriginsParsed;
        if (allowed === true || (Array.isArray(allowed) && allowed.includes("*"))) {
          return callback(null, true);
        }
        if (!origin) {
          return callback(null, true);
        }
        if (Array.isArray(allowed) && allowed.includes(origin)) {
          return callback(null, true);
        }
        return callback(null, false);
      },
      credentials: true,
    }),
  );

  // --- Request logging: concise line per request (pick format by env) ---
  app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"));

  // --- Parse JSON bodies (POST/PUT/PATCH) ---
  app.use(express.json());

  // --- API version prefix: all REST routes live under /api ---
  app.use("/api", apiRouter);

  // --- Unmatched routes → JSON 404 ---
  app.use(notFound);

  // --- Central error handler (must be last) ---
  app.use(errorHandler);

  return app;
}
