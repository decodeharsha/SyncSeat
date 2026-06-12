/**
 * Auth Context — global authentication state for SyncSeat.
 *
 * AUTH CONTEXT
 * ------------
 * React Context shares `user`, `login`, and `logout` with any component under
 * `<AuthProvider>` without prop drilling. `useAuth()` reads this value.
 *
 * localStorage PERSISTENCE
 * ------------------------
 * Tokens survive page refreshes. On startup we read the JWT from localStorage
 * and call GET /api/auth/me to confirm it is still valid before marking the
 * user as signed in.
 *
 * LOGIN FLOW
 * ----------
 * 1. User submits credentials on LoginPage.
 * 2. `login()` calls POST /api/auth/login.
 * 3. JWT and user profile are saved to state + localStorage.
 * 4. Axios interceptor attaches the token on subsequent API calls.
 *
 * LOGOUT FLOW
 * -----------
 * 1. User clicks Log out.
 * 2. `logout()` clears token, cached user, and React state.
 * 3. Protected routes redirect to login because `isAuthenticated` is false.
 */

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  clearAuthStorage,
  getCurrentUser,
  getStoredUser,
  getToken,
  loginUser,
  setStoredUser,
  setToken,
} from '../services/authService.js'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser())
  const [isLoading, setIsLoading] = useState(true)

  /**
   * On app startup: if a token exists in localStorage, validate it by loading
   * the current user from the API. Invalid or expired tokens are cleared.
   */
  useEffect(() => {
    async function restoreSession() {
      const token = getToken()

      if (!token) {
        setUser(null)
        setIsLoading(false)
        return
      }

      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        setStoredUser(currentUser)
      } catch {
        clearAuthStorage()
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    restoreSession()
  }, [])

  const login = useCallback(async (email, password) => {
    const { token, user: authenticatedUser } = await loginUser({
      email,
      password,
    })

    setToken(token)
    setStoredUser(authenticatedUser)
    setUser(authenticatedUser)
  }, [])

  const logout = useCallback(() => {
    clearAuthStorage()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
