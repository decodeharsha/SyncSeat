/**
 * =============================================================================
 * controllers/eventController.js — HTTP handlers for events
 * =============================================================================
 * WHAT THIS FILE DOES:
 *   Maps GET /api/events to the event service and sends JSON. No business
 *   rules here — only status codes and response envelope (`success`, `data`).
 *
 * LAYER: Controller (HTTP adapter; thin).
 * =============================================================================
 */

import { getAllEvents as fetchAllEvents } from "../services/eventService.js";

/**
 * GET /api/events
 * @type {import('express').RequestHandler}
 */
export async function getAllEvents(req, res) {
  const events = await fetchAllEvents();
  res.status(200).json({ success: true, data: events });
}
