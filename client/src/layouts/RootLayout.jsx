/**
 * Root layout — wraps every page with shared chrome (header) and `<Outlet />`
 * for nested routes.
 *
 * React Router layouts scale well: add a footer, error boundary, or analytics
 * provider here once instead of importing it into every page component.
 */

import { Outlet } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader.jsx'

export function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
