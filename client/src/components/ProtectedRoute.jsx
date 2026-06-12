/**
 * Protected route guard — authentication layer for private sections.
 *
 * AUTHENTICATION VS AUTHORIZATION
 * -------------------------------
 * Authentication proves identity ("who are you?"). This route checks
 * `isAuthenticated` from Auth Context and sends guests to `/login`.
 * Authorization (what they may do) is handled separately — e.g. `AdminRoute`
 * for role-based pages and the API's `requireAdmin` middleware for mutations.
 *
 * PROTECTED ROUTES
 * ----------------
 * Dashboard and other signed-in areas render through `<Outlet />` only when a
 * valid session exists. The attempted URL is saved in location state so login
 * can return the user to where they were headed.
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { ROUTES } from '../utils/constants.js'

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-16 text-sm text-slate-400">
        Restoring session…
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />
    )
  }

  return <Outlet />
}
