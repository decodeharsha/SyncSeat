/**
 * =============================================================================
 * services/eventService.js — Event listing business logic
 * =============================================================================
 * WHAT THIS FILE DOES:
 *   Loads events from the database via Prisma. Controllers call `getAllEvents()`
 *   and never touch the ORM directly.
 *
 * WHY SERVICES ACCESS PRISMA (NOT CONTROLLERS)
 * --------------------------------------------
 * Controllers should only handle HTTP: status codes, request/response shape.
 * Database access is business/infrastructure logic. Keeping Prisma in services
 * means you can reuse `getAllEvents()` from a CLI script, a cron job, or a
 * Socket handler without copying query code.
 *
 * WHAT findMany() DOES
 * --------------------
 * `prisma.event.findMany()` runs a SELECT that returns all rows in the Event
 * table (with no `where` filter). Prisma maps rows to JavaScript objects with
 * fields matching your schema (id, title, venue, date).
 *
 * WHY THIS ARCHITECTURE SCALES
 * ----------------------------
 * As SyncSeat grows, you add filters, pagination, and joins in this one service
 * file while routes and controllers stay stable. Swap PostgreSQL details, add
 * caching, or split into repositories later without rewriting every endpoint.
 *
 * LAYER: Service (domain/application logic; no req/res).
 * =============================================================================
 */

import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

/**
 * Return all events for listing (public browse, dashboards, etc.).
 * @returns {Promise<Array<{ id: number, title: string, venue: string, date: Date }>>}
 */
export async function getAllEvents() {
  const events = await prisma.event.findMany({
    orderBy: { date: "asc" },
  });

  return events;
}

/**
 * Create a new event and persist it to the database.
 *
 * WHY DATABASE LOGIC LIVES IN THE SERVICE
 * ---------------------------------------
 * `create()` knows table columns, types, and defaults. Controllers only pass
 * plain fields from the HTTP body; this function turns them into a Prisma call.
 *
 * WHAT Prisma create() DOES
 * -------------------------
 * `prisma.event.create({ data: { ... } })` runs an INSERT for one row and
 * returns the saved record (including auto-generated `id`). Unlike createMany(),
 * create() inserts a single row and gives you the full object back.
 *
 * @param {{ title: string, venue: string, date: string | Date }} input
 * @returns {Promise<{ id: number, title: string, venue: string, date: Date }>}
 */
export async function createEvent({ title, venue, date }) {
  if (!title?.trim() || !venue?.trim() || !date) {
    throw new AppError("title, venue, and date are required", 400);
  }

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new AppError("date must be a valid date or ISO string", 400);
  }

  const event = await prisma.event.create({
    data: {
      title: title.trim(),
      venue: venue.trim(),
      date: parsedDate,
    },
  });

  return event;
}

/**
 * Parse a route `:id` segment into a numeric primary key.
 * @param {string} rawId — from `req.params.id`
 */
function parseEventId(rawId) {
  const id = Number.parseInt(String(rawId), 10);
  if (Number.isNaN(id) || id < 1) {
    throw new AppError("Invalid event id", 400);
  }
  return id;
}

/**
 * Fetch one event by primary key.
 *
 * WHAT findUnique() DOES
 * ----------------------
 * `findUnique({ where: { id } })` runs a SELECT for at most one row matching
 * the unique `id` column. Returns `null` if no row exists (we map that to 404).
 *
 * @param {string | number} id
 */
export async function getEventById(id) {
  const eventId = parseEventId(id);

  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  return event;
}

/**
 * Update an existing event and return the saved row.
 *
 * WHY SERVICES CONTAIN BUSINESS LOGIC
 * -------------------------------------
 * Validation, date parsing, and not-found handling belong here — not in the
 * controller. The HTTP layer only passes `id` and body fields; this function
 * decides what is valid and how to persist changes.
 *
 * WHAT update() DOES
 * ------------------
 * `prisma.event.update({ where, data })` runs an UPDATE for the row matching
 * `where` and returns the row after changes. Prisma throws if the id does not
 * exist; we catch that and respond with a clear 404.
 *
 * @param {string | number} id
 * @param {{ title: string, venue: string, date: string | Date }} eventData
 */
export async function updateEvent(id, eventData) {
  const eventId = parseEventId(id);
  const { title, venue, date } = eventData;

  if (!title?.trim() || !venue?.trim() || !date) {
    throw new AppError("title, venue, and date are required", 400);
  }

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new AppError("date must be a valid date or ISO string", 400);
  }

  try {
    const event = await prisma.event.update({
      where: { id: eventId },
      data: {
        title: title.trim(),
        venue: venue.trim(),
        date: parsedDate,
      },
    });

    return event;
  } catch (err) {
    if (err?.code === "P2025") {
      throw new AppError("Event not found", 404);
    }
    throw err;
  }
}

/**
 * Remove an event by primary key.
 *
 * WHY DATABASE LOGIC BELONGS IN SERVICES
 * --------------------------------------
 * Parsing `id`, checking it exists, and calling Prisma stay here so controllers
 * only handle HTTP. The same delete logic can be reused from admin scripts or
 * background jobs without duplicating ORM code at the route layer.
 *
 * WHAT delete() DOES
 * ------------------
 * `prisma.event.delete({ where: { id } })` runs a DELETE for the row matching
 * `where`. Prisma removes exactly one record and returns the deleted row. If no
 * row matches, Prisma throws `P2025` (we map that to a 404).
 *
 * @param {string | number} id
 */
export async function deleteEvent(id) {
  const eventId = parseEventId(id);

  try {
    await prisma.event.delete({
      where: { id: eventId },
    });
  } catch (err) {
    if (err?.code === "P2025") {
      throw new AppError("Event not found", 404);
    }
    throw err;
  }
}
