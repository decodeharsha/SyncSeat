/**
 * Home page for SyncSeat
 *
 * Purpose of current version:
 * - Keep landing page UI
 * - Test frontend ↔ backend communication
 * - Display backend health status
 * - List upcoming events from GET /api/events
 */

import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { ROUTES } from '../utils/constants.js'
import { fetchHealth } from '../services/healthService.js'
import { fetchEvents } from '../services/eventService.js'

export function HomePage() {
  const [backendStatus, setBackendStatus] = useState('Checking...')

  /**
   * STATE: `events`
   * React re-renders the UI when state changes. We start with `[]` so the first
   * paint is safe (no undefined errors in `.map()`). After the API responds,
   * we replace the array and the event cards appear.
   */
  const [events, setEvents] = useState([])

  useEffect(() => {
    const fetchBackendStatus = async () => {
      try {
        const data = await fetchHealth()
        setBackendStatus(data.status)
      } catch (error) {
        console.error('Health check failed:', error)
        setBackendStatus('Server Offline')
      }
    }

    fetchBackendStatus()
  }, [])

  /**
   * useEffect runs after the component mounts (page load).
   * We load events here — not in the render body — so we do not fire duplicate
   * requests on every re-render and we keep side effects out of the UI return path.
   * The empty dependency array `[]` means "run once when this page loads."
   */
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents()
        setEvents(data)
      } catch (error) {
        console.error('Failed to load events:', error)
      }
    }

    loadEvents()
  }, [])

  return (
    <div className="flex flex-1 flex-col gap-10">
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-violet-950/40 p-10 md:p-14">
        <p className="text-sm font-medium uppercase tracking-wider text-violet-300">
          Event booking, synchronized
        </p>

        <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
          SyncSeat helps teams sell seats, manage capacity, and keep attendees in
          the loop.
        </h1>

        <p className="mt-4 max-w-xl text-slate-300">
          This frontend uses a layered structure (pages, layouts, services,
          hooks) so you can grow from demo routes to a full production app without
          reorganizing everything.
        </p>

        {/* Backend status card */}
        <div className="mt-6 rounded-lg border border-slate-700 bg-slate-900 p-4">
          <h3 className="text-sm font-semibold text-violet-300">
            Backend Status
          </h3>

          <p className="mt-2 text-slate-300">{backendStatus}</p>
        </div>

        {/* Upcoming Events — one card per item via .map() */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-violet-300">
            Upcoming Events
          </h3>

          {events.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">Loading events…</p>
          ) : (
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {/*
                map() turns the events array into a list of JSX cards.
                Each event object becomes one card; `key={event.id}` helps React
                track rows efficiently when the list updates.
              */}
              {events.map((event) => (
                <li
                  key={event.id}
                  className="rounded-lg border border-slate-700 bg-slate-900 p-4"
                >
                  <p className="font-semibold text-white">{event.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{event.venue}</p>
                  <p className="mt-1 text-sm text-slate-500">{event.date}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={ROUTES.login}
            className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 hover:bg-violet-500"
          >
            Sign in
          </Link>

          <Link
            to={ROUTES.dashboard}
            className="inline-flex items-center justify-center rounded-lg border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-100 hover:border-slate-400"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
