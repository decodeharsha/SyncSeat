/**
 * Auth context object (no components in this module).
 *
 * Split from `AuthProvider.jsx` so React Fast Refresh can treat the provider
 * file as a component-only module, which keeps HMR predictable during development.
 */

import { createContext } from 'react'

export const AuthContext = createContext(null)
