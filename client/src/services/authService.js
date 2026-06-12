/**
 * Authentication API — register, login, and session helpers for SyncSeat.
 *
 * JWT STORAGE
 * -----------
 * After login the server returns a token. We persist it in localStorage via
 * `setToken()` so the Axios interceptor can attach `Authorization: Bearer <token>`
 * on every request without each page handling headers manually.
 *
 * WHY SERVICE FILES CENTRALIZE API REQUESTS
 * -----------------------------------------
 * URLs, verbs, and response parsing live here once. Pages and context call
 * `loginUser()` instead of repeating `api.post('/api/auth/login', ...)`.
 */

import { api } from './apiClient.js'
import { STORAGE_KEYS } from '../utils/constants.js'

/** Read the stored JWT (or null if signed out). */
export function getToken() {
  return localStorage.getItem(STORAGE_KEYS.authToken)
}

/** Persist JWT after a successful login. */
export function setToken(token) {
  localStorage.setItem(STORAGE_KEYS.authToken, token)
}

/** Remove JWT from storage on logout or failed session restore. */
export function clearToken() {
  localStorage.removeItem(STORAGE_KEYS.authToken)
}

/** Read cached user profile from localStorage (optional fast paint). */
export function getStoredUser() {
  const raw = localStorage.getItem(STORAGE_KEYS.user)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    localStorage.removeItem(STORAGE_KEYS.user)
    return null
  }
}

/** Cache user profile alongside the token for quick UI hydration. */
export function setStoredUser(user) {
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user))
}

/** Remove cached user profile. */
export function clearStoredUser() {
  localStorage.removeItem(STORAGE_KEYS.user)
}

/** Clear all auth-related keys from localStorage. */
export function clearAuthStorage() {
  clearToken()
  clearStoredUser()
}

/**
 * Register a new account.
 *
 * @param {{ name: string, email: string, password: string }} userData
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function registerUser(userData) {
  const { data } = await api.post('/api/auth/register', {
    name: userData.name,
    email: userData.email,
    password: userData.password,
  })

  return data
}

/**
 * Authenticate and receive a JWT plus user profile.
 *
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ token: string, user: { id: number, name: string, email: string, role: string } }>}
 */
export async function loginUser(credentials) {
  const { data } = await api.post('/api/auth/login', {
    email: credentials.email,
    password: credentials.password,
  })

  return {
    token: data.token,
    user: data.user,
  }
}

/**
 * Load the currently authenticated user (requires valid JWT in storage).
 *
 * @returns {Promise<{ id: number, name: string, email: string, role: string }>}
 */
export async function getCurrentUser() {
  const { data } = await api.get('/api/auth/me')
  return data.user
}
