/**
 * Typed-ish accessor for AuthContext.
 *
 * Why a hook file: importing context + useContext in every component is noisy;
 * this enforces "only use auth inside the provider tree" with a clear error.
 */

import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
