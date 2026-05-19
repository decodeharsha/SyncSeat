/**
 * =============================================================================
 * middleware/errorHandler.js — Centralized Express error handler
 * =============================================================================
 * WHAT THIS FILE DOES:
 *   One place to translate errors (AppError, Zod validation, unknown bugs)
 *   into consistent JSON. Register this AFTER all routes with 4 parameters
 *   `(err, req, res, next)` — Express treats that signature as error middleware.
 *
 * LAYER: Middleware (HTTP cross-cutting concern).
 * =============================================================================
 */

import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";
import { config } from "../config/index.js";

/**
 * Express error-handling middleware (must have 4 arguments).
 * @type {import('express').ErrorRequestHandler}
 */
export function errorHandler(err, req, res, next) {
  // If headers already sent, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  /** @type {Record<string, unknown>} */
  const body = {
    success: false,
    error: {
      message: "Something went wrong",
    },
  };

  let statusCode = 500;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    body.error.message = err.message;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    body.error.message = "Validation failed";
    body.error.details = err.flatten();
  } else if (err && typeof err === "object" && "statusCode" in err) {
    const code = Number(err.statusCode);
    if (!Number.isNaN(code) && code >= 400 && code < 600) {
      statusCode = code;
      body.error.message =
        "message" in err && typeof err.message === "string"
          ? err.message
          : body.error.message;
    }
  }

  // Never leak stack traces to clients in production
  if (config.nodeEnv !== "production") {
    body.error.stack = err?.stack;
  }

  res.status(statusCode).json(body);
}
