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
 * or created event), not the full response with `status`, `headers`, and
 * `config`. Components work with plain data: `events.map(...)` or the new event
 * object after create — not `response.data.data`.
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
