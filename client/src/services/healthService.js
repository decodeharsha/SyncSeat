/**
 * Health / readiness API — thin wrapper around the HTTP client.
 *
 * Pattern: one file per domain area (events, bookings, auth). Each exports
 * async functions that return data (not raw Axios responses) so pages/hooks
 * stay decoupled from transport details.
 */

import { api } from './apiClient.js'

/**
 * @returns {Promise<{ success: boolean, data: Record<string, unknown> }>}
 */
export async function fetchHealth() {
  const { data } = await api.get('/api/health')
  return data
}
