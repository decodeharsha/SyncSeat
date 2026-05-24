/**
 * =============================================================================
 * controllers/eventController.js — HTTP handlers for events
 * =============================================================================
 * WHAT THIS FILE DOES:
 *   Maps event routes to the event service and sends JSON. No database access
 *   here — only status codes and the response envelope (`success`, `data`).
 *
 * LAYER: Controller (HTTP adapter; thin).
 * =============================================================================
 */

import {
  getAllEvents as fetchAllEvents,
  createEvent as saveEvent,
} from "../services/eventService.js";

/**
 * GET /api/events
 * @type {import('express').RequestHandler}
 */
export async function getAllEvents(req, res) {
  const events = await fetchAllEvents();
  res.status(200).json({ success: true, data: events });
}

/**
 * POST /api/events
 *
 * REQUEST BODY USAGE
 * ------------------
 * Express parses JSON into `req.body` (via `express.json()` in app.js).
 * Clients send `{ "title": "...", "venue": "...", "date": "2026-06-15" }`.
 * We destructure those fields and pass them to the service — the controller
 * does not build SQL or Prisma queries.
 *
 * @type {import('express').RequestHandler}
 */
export async function createEvent(req, res) {
  const { title, venue, date } = req.body;

  const event = await saveEvent({ title, venue, date });

  res.status(201).json({ success: true, data: event });
}
