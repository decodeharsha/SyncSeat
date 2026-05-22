/**
 * Events API — domain-specific calls for SyncSeat.
 *
 * WHY SERVICE FILES EXIST
 * -----------------------
 * Service modules are the single place that knows *how* to talk to the backend
 * (URLs, HTTP verbs, response shape). Pages and components stay focused on UI
 * and user flows. When the API changes, you update one file instead of hunting
 * through every screen that fetches events.
 *
 * WHY PAGES SHOULD NOT CALL AXIOS DIRECTLY
 * ----------------------------------------
 * If each page imported `api` and built its own `GET /api/events` call, you would
 * duplicate base URLs, auth headers, error handling, and response parsing. That
 * makes bugs likely and refactors painful. Pages should call `fetchEvents()` (or a
 * hook that wraps it), not Axios.
 *
 * WHY WE RETURN ONLY DATA (NOT THE FULL AXIOS RESPONSE)
 * -----------------------------------------------------
 * An Axios response includes `status`, `headers`, `config`, and more — UI code
 * does not need that noise. We destructure `{ data }` from the response and return
 * the event list from the API body so components receive a plain array they can
 * map over: `events.map(...)` instead of `response.data.data.map(...)`.
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
