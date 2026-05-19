/**
 * Central route configuration.
 *
 * Why `createBrowserRouter` + `RouterProvider`:
 * - Data APIs, loaders, and error boundaries integrate cleanly as you scale.
 * - Route definitions stay in one module (easy to grep) instead of JSX trees
 *   scattered across the app.
 *
 * Nesting: `RootLayout` → public pages; `ProtectedRoute` → `DashboardLayout`
 * → private pages. Add more layout segments (e.g. `/org/:id`) as needed.
 */

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RootLayout } from '../layouts/RootLayout.jsx'
import { DashboardLayout } from '../layouts/DashboardLayout.jsx'
import { ProtectedRoute } from '../components/ProtectedRoute.jsx'
import { HomePage } from '../pages/HomePage.jsx'
import { LoginPage } from '../pages/LoginPage.jsx'
import { DashboardPage } from '../pages/DashboardPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      {
        path: 'dashboard',
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [{ index: true, element: <DashboardPage /> }],
          },
        ],
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
