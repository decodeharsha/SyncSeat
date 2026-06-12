/**
 * Admin route guard — authorization layer for organizer tools.
 *
 * AUTHENTICATION VS AUTHORIZATION
 * -------------------------------
 * `ProtectedRoute` checks whether someone is signed in (authentication).
 * `AdminRoute` checks whether their role is `ADMIN` (authorization).
 *
 * ROLE-BASED ACCESS CONTROL
 * -------------------------
 * Not every signed-in user may create or edit events. This component reads
 * `user.role` from Auth Context and only renders child routes for admins.
 *
 * ADMIN-ONLY ACTIONS
 * ------------------
 * Create and edit event pages sit behind this guard. Regular `USER` accounts
 * are redirected home instead of seeing forms they cannot use on the API.
 */

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { ROUTES } from '../utils/constants.js'

const ADMIN_ROLE = 'ADMIN'

export function AdminRoute() {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-16 text-sm text-slate-400">
        Restoring session…
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.login} replace />
  }

  if (user.role !== ADMIN_ROLE) {
    return <Navigate to={ROUTES.home} replace />
  }

  return <Outlet />
}
