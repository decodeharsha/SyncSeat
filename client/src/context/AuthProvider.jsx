/**
 * Authentication provider (client-side session).
 *
 * Architectural decisions:
 * - React Context is fine for medium apps; for very large trees consider
 *   splitting auth state into a dedicated store (Zustand/Redux) later.
 * - Initial user is read via `useState(lazyInit)` instead of `useEffect` to
 *   avoid an extra render and satisfy strict lint rules about effects.
 * - Replace `login` with `POST /api/auth/login` and map the response to `user`.
 */

import { useCallback, useMemo, useState } from 'react'
import { AuthContext } from './authContext.js'
import { STORAGE_KEYS } from '../utils/constants.js'

function readStoredUser() {
  const token = localStorage.getItem(STORAGE_KEYS.authToken)
  const raw = localStorage.getItem(STORAGE_KEYS.user)
  if (!token || !raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    localStorage.removeItem(STORAGE_KEYS.authToken)
    localStorage.removeItem(STORAGE_KEYS.user)
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser())

  const login = useCallback(async (email, password) => {
    if (!password) {
      throw new Error('Please enter your password.')
    }
    const token = 'demo-token'
    const nextUser = {
      id: 'demo-user',
      email,
      displayName: email.split('@')[0] || 'Guest',
    }
    localStorage.setItem(STORAGE_KEYS.authToken, token)
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(nextUser))
    setUser(nextUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.authToken)
    localStorage.removeItem(STORAGE_KEYS.user)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
