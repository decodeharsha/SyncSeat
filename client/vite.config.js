import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Vite config for SyncSeat client.
 *
 * Architectural note: Tailwind is wired as a Vite plugin (@tailwindcss/vite)
 * instead of a separate PostCSS pipeline — fewer moving parts and fast HMR.
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    /** Dev-only: if the API runs on another port, CORS is handled server-side */
    port: 5173,
  },
})
