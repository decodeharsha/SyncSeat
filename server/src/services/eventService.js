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
