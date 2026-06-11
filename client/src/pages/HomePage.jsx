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
import { deleteEvent, fetchEvents } from '../services/eventService.js'

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

  /** Reload events from the API — used on mount and after a successful delete. */
  const loadEvents = async () => {
    try {
      const data = await fetchEvents()
      setEvents(data)
    } catch (error) {
      console.error('Failed to load events:', error)
    }
  }

  /**
   * useEffect runs after the component mounts (page load).
   * We load events here — not in the render body — so we do not fire duplicate
   * requests on every re-render and we keep side effects out of the UI return path.
   * The empty dependency array `[]` means "run once when this page loads."
   */
  useEffect(() => {
    loadEvents()
  }, [])

  /**
   * CONFIRMATION DIALOGS
   * --------------------
   * `window.confirm` pauses the flow and asks the user to approve or cancel.
   * That extra step catches accidental clicks — especially on touch screens —
   * before an irreversible action runs.
   *
   * DESTRUCTIVE ACTIONS
   * -------------------
   * Delete removes data from the server with no undo in this UI. We only call
   * `deleteEvent` after the user confirms, so a stray click cannot wipe an event.
   *
   * REFRESHING AFTER DELETE
   * -----------------------
   * `loadEvents()` re-fetches the list and updates `events` state so the removed
   * card disappears immediately and the UI stays in sync with the database.
   */
  const handleDeleteEvent = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this event?',
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteEvent(id)
      await loadEvents()
    } catch (error) {
      console.error('Failed to delete event:', error)
    }
  }

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
                  className="flex flex-col rounded-lg border border-slate-700 bg-slate-900 p-4"
                >
                  <p className="font-semibold text-white">{event.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{event.venue}</p>
                  <p className="mt-1 text-sm text-slate-500">{event.date}</p>

                  <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
                    {/*
                      Route parameters: `event.id` is interpolated into the path
                      (`/dashboard/events/:id/edit`). EditEventPage reads that `:id`
                      segment via useParams() to load and update the correct row —
                      one reusable edit screen for every event instead of a page per id.
                    */}
                    {/*
                      Link (not <a href>): React Router updates the URL and swaps the
                      matched route without a full document reload, so app state and
                      layout stay intact and navigation feels instant in this SPA.
                    */}
                    <Link
                      to={ROUTES.editEvent(event.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-200 transition duration-200 hover:border-violet-500/70 hover:bg-violet-950/40 hover:text-violet-200 hover:shadow-md hover:shadow-violet-950/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 sm:px-3.5 sm:py-2 sm:text-sm"
                    >
                      <svg
                        className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                      Edit Event
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(event.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-900/60 bg-red-950/30 px-3 py-1.5 text-xs font-semibold text-red-300 transition duration-200 hover:border-red-500/80 hover:bg-red-950/60 hover:text-red-100 hover:shadow-md hover:shadow-red-950/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 sm:px-3.5 sm:py-2 sm:text-sm"
                    >
                      <svg
                        className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                      Delete Event
                    </button>
                  </div>
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
