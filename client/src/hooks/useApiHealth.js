/**
 * Example data hook: wraps a service call with loading / error state.
 *
 * Pattern: pages stay declarative; reusable hooks encapsulate effects and
 * caching policy (SWR/React Query can replace this later without changing UI).
 */

import { useEffect, useState } from 'react'
import { fetchHealth } from '../services/healthService.js'

export function useApiHealth() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchHealth()
      .then((res) => {
        if (!cancelled) setData(res)
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { data, error, loading }
}
