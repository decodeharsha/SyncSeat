/**
 * Authenticated shell — sidebar + content area for organizer tools.
 *
 * Splitting "marketing/public" layouts from "app" layouts mirrors how teams
 * ship different nav patterns and keeps bundle boundaries clearer over time.
 */

import { NavLink, Outlet } from 'react-router-dom'
import { ROUTES } from '../utils/constants.js'

const subLink = ({ isActive }) =>
  [
    'block rounded-md px-3 py-2 text-sm',
    isActive
      ? 'bg-slate-800 text-white'
      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white',
  ].join(' ')

export function DashboardLayout() {
  return (
    <div className="grid flex-1 gap-8 md:grid-cols-[220px_1fr]">
      <aside className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Workspace
        </p>
        <nav className="flex flex-col gap-1">
          <NavLink to={ROUTES.dashboard} className={subLink} end>
            Overview
          </NavLink>
          {/* Placeholder links — wire to real pages as the product grows */}
          <NavLink to={ROUTES.createEvent} className={subLink}>
            Create event
          </NavLink>
          <span className="block cursor-not-allowed rounded-md px-3 py-2 text-sm text-slate-600">
            Bookings (soon)
          </span>
        </nav>
      </aside>
      <section className="min-w-0">
        <Outlet />
      </section>
    </div>
  )
}
