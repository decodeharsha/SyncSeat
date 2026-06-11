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
  getEventById as fetchEventById,
  updateEvent as saveEventUpdate,
  deleteEvent as removeEvent,
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
 * GET /api/events/:id
 *
 * ROUTE PARAMETERS
 * ----------------
 * Express puts dynamic URL segments in `req.params`. For `/api/events/3`,
 * `req.params.id` is `"3"`. We pass that string to the service, which parses
 * and validates it before querying the database.
 *
 * @type {import('express').RequestHandler}
 */
export async function getEventById(req, res) {
  const event = await fetchEventById(req.params.id);
  res.status(200).json({ success: true, data: event });
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

/**
 * PUT /api/events/:id
 *
 * Combines a route parameter (`id`) with a JSON body (`title`, `venue`, `date`).
 * The service runs Prisma `update()` and returns the updated event.
 *
 * @type {import('express').RequestHandler}
 */
export async function updateEvent(req, res) {
  const { title, venue, date } = req.body;

  const event = await saveEventUpdate(req.params.id, { title, venue, date });

  res.status(200).json({ success: true, data: event });
}

/**
 * DELETE /api/events/:id
 *
 * ROUTE PARAMETERS
 * ----------------
 * `:id` in the path becomes `req.params.id` (e.g. `/api/events/5` → `"5"`).
 * We pass that segment to the service, which validates and deletes the matching
 * row — the controller does not run Prisma or interpret database errors.
 *
 * @type {import('express').RequestHandler}
 */
export async function deleteEvent(req, res) {
  await removeEvent(req.params.id);

  res.status(200).json({
    success: true,
    message: "Event deleted successfully",
  });
}
