/**
 * Axios HTTP client — single entry for all REST calls.
 *
 * Architectural decisions:
 * - One `create()` instance enforces a consistent baseURL, timeouts, and headers.
 * - Request interceptor reads the JWT from localStorage and sends
 *   `Authorization: Bearer <token>` on every API call when the user is signed in.
 * - Response interceptor is the right place for global 401 handling / refresh
 *   tokens when you connect a real auth API.
 */

import axios from 'axios'
import { STORAGE_KEYS } from '../utils/constants.js'

const baseURL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:3000'

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  /** Enable when API uses cookies; coordinate with server CORS credentials */
  withCredentials: true,
  timeout: 15_000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.authToken)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Placeholder: centralized logging or toast notifications
    return Promise.reject(error)
  },
)
