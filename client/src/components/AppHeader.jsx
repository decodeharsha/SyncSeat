/**
 * Primary site chrome — navigation lives here, not duplicated per page.
 *
 * Keeping navigation in a layout-level component avoids drift when new routes
 * are added; pair with `ROUTES` constants for consistent paths.
 */

import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { ROUTES } from '../utils/constants.js'

const linkClass = ({ isActive }) =>
  [
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-violet-600 text-white'
      : 'text-slate-300 hover:bg-slate-800 hover:text-white',
  ].join(' ')

export function AppHeader() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <NavLink
          to={ROUTES.home}
          className="text-lg font-semibold tracking-tight text-white"
        >
          SyncSeat
        </NavLink>
        <nav className="flex flex-wrap items-center gap-1">
          <NavLink to={ROUTES.home} className={linkClass} end>
            Home
          </NavLink>
          <NavLink to={ROUTES.login} className={linkClass}>
            Login
          </NavLink>
          {isAuthenticated && (
            <NavLink to={ROUTES.dashboard} className={linkClass}>
              Dashboard
            </NavLink>
          )}
          {isAuthenticated && (
            <button
              type="button"
              onClick={logout}
              className="ml-1 rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-slate-500 hover:text-white"
            >
              Log out
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
