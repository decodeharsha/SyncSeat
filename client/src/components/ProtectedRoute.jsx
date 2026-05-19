/**
 * Route guard for authenticated sections.
 *
 * Uses a layout-route pattern: parent route renders `<ProtectedRoute />` with
 * nested `children` rendered via `<Outlet />`. Unauthorized users are sent to
 * login with `replace` so the back button does not trap them in a private URL.
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { ROUTES } from '../utils/constants.js'

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />
    )
  }

  return <Outlet />
}
