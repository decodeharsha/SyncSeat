/**
 * Dashboard overview — first screen after authentication.
 *
 * Demonstrates: auth-derived UI + a service-backed health check. As the app
 * grows, split widgets into `components/dashboard/*` and keep this page as a
 * composition root only.
 */

import { useAuth } from '../hooks/useAuth.js'
import { useApiHealth } from '../hooks/useApiHealth.js'

export function DashboardPage() {
  const { user } = useAuth()
  const { data, error, loading } = useApiHealth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Overview</h1>
        <p className="mt-1 text-slate-400">
          Signed in as{' '}
          <span className="font-medium text-slate-200">{user?.email}</span>
        </p>
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          API status
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Fetched via Axios from <code className="text-violet-300">GET /api/health</code>
        </p>
        {loading && <p className="mt-3 text-slate-300">Loading…</p>}
        {error && (
          <p className="mt-3 text-sm text-amber-300">
            Could not reach API ({error.message}). Ensure the server is running and
            CORS allows this origin.
          </p>
        )}
        {data && (
          <pre className="mt-4 max-h-64 overflow-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-300">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}
