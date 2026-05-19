/**
 * Centralized route paths and storage keys.
 *
 * Why: magic strings scatter across the app and break refactors. Import
 * `ROUTES` / `STORAGE_KEYS` from here so navigation and persistence stay aligned.
 */

/** Public route pathnames (extend as you add marketing, legal, etc.) */
export const ROUTES = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
}

/** localStorage keys — keep unique to avoid collisions with third-party scripts */
export const STORAGE_KEYS = {
  authToken: 'syncseat.authToken',
  user: 'syncseat.user',
}
