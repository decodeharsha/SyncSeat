/**
 * =============================================================================
 * services/eventService.js — Event listing business logic
 * =============================================================================
 * WHAT THIS FILE DOES:
 *   Owns how events are fetched and shaped for the API. Controllers call
 *   `getAllEvents()`; this layer will later swap mock data for Prisma/DB
 *   queries without changing route or controller signatures.
 *
 * LAYER: Service (domain/application logic; no req/res).
 * =============================================================================
 */

/**
 * Mock catalog until a database model is wired up.
 * Keep field names stable — the client can rely on id, title, venue, date.
 */
const MOCK_EVENTS = [
  {
    id: 1,
    title: "Tech Conference 2026",
    venue: "Hyderabad Convention Center",
    date: "2026-06-15",
  },
  {
    id: 2,
    title: "Startup Summit",
    venue: "Bangalore Expo Hall",
    date: "2026-07-10",
  },
];

/**
 * Return all events available for listing (public browse, dashboards, etc.).
 * @returns {Promise<Array<{ id: number, title: string, venue: string, date: string }>>}
 */
export async function getAllEvents() {
  // async return mirrors a future DB call; swap body for prisma.event.findMany()
  return [...MOCK_EVENTS];
}
