/**
 * Events API — domain-specific calls for SyncSeat.
 *
 * WHY SERVICE FILES CENTRALIZE API REQUESTS
 * -----------------------------------------
 * Every endpoint (list, create, update) lives in one module. URLs, HTTP verbs,
 * and response parsing are defined once. When the backend changes, you update
 * this file instead of every page that talks to events.
 *
 * WHY PAGES SHOULD NOT DIRECTLY CALL AXIOS
 * ----------------------------------------
 * Axios setup (base URL, auth headers, interceptors) belongs in `apiClient.js`.
 * Pages should call `fetchEvents()` or `createEvent()` so UI code never repeats
 * `api.post('/api/events', ...)` or handles raw response objects.
 *
 * WHY RETURNING RESPONSE DATA KEEPS COMPONENTS CLEANER
 * ----------------------------------------------------
 * We destructure `{ data }` from Axios and return the useful payload (event list
 * or a single event), not the full response with `status`, `headers`, and
 * `config`. Components work with plain data — not `response.data.data`.
 *
 * DYNAMIC ROUTE PARAMETERS
 * ------------------------
 * Endpoints like `/api/events/:id` need an id in the URL. Service functions
 * accept `id` as an argument and build the path (`/api/events/${id}`) so pages
 * pass a number or string without hand-crafting URLs in every component.
 */

import { api } from './apiClient.js'

/**
 * Fetch all events for listing (home page, browse, etc.).
 *
 * @returns {Promise<Array<{ id: number, title: string, venue: string, date: string }>>}
 */
export async function fetchEvents() {
  const { data } = await api.get('/api/events')
  return data.data
}

/**
 * Create a new event.
 *
 * @param {{ title: string, venue: string, date: string }} eventData
 * @returns {Promise<{ id: number, title: string, venue: string, date: string }>}
 */
export async function createEvent(eventData) {
  const { data } = await api.post('/api/events', {
    title: eventData.title,
    venue: eventData.venue,
    date: eventData.date,
  })

  return data.data
}

/**
 * Fetch one event by id.
 *
 * @param {string | number} id — inserted into GET /api/events/:id
 * @returns {Promise<{ id: number, title: string, venue: string, date: string }>}
 */
export async function fetchEventById(id) {
  const { data } = await api.get(`/api/events/${id}`)
  return data.data
}

/**
 * Update an existing event.
 *
 * @param {string | number} id — inserted into PUT /api/events/:id
 * @param {{ title: string, venue: string, date: string }} eventData
 * @returns {Promise<{ id: number, title: string, venue: string, date: string }>}
 */
export async function updateEvent(id, eventData) {
  const { data } = await api.put(`/api/events/${id}`, {
    title: eventData.title,
    venue: eventData.venue,
    date: eventData.date,
  })

  return data.data
}

/**
 * Delete an event by id.
 *
 * @param {string | number} id — inserted into DELETE /api/events/:id
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function deleteEvent(id) {
  const { data } = await api.delete(`/api/events/${id}`)
  return data
}
