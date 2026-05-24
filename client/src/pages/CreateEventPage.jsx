/**
 * Create Event page — organizer form to publish new events.
 *
 * CONTROLLED COMPONENTS
 * ---------------------
 * Each input's `value` comes from React state and `onChange` updates that state.
 * React is the single source of truth for the field values (not the DOM alone).
 *
 * useState PURPOSE
 * ----------------
 * We track form fields (title, venue, date), loading, success, and errors.
 * When state updates, React re-renders so the UI reflects the latest values.
 *
 * FORM SUBMISSION FLOW
 * --------------------
 * 1. User clicks Submit → `handleSubmit` runs
 * 2. `e.preventDefault()` stops a full page reload
 * 3. `createEvent()` sends JSON to the API
 * 4. On success: clear fields, show success message
 * 5. On failure: show error message
 *
 * ASYNC API HANDLING
 * ------------------
 * `createEvent` returns a Promise. We set `loading` true before the call and
 * false in `finally` so the button stays disabled and shows "Creating..." until
 * the request completes (success or error).
 */

import { useState } from 'react'
import { createEvent } from '../services/eventService.js'

function FieldIcon({ children }) {
  return (
    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
      {children}
    </span>
  )
}

export function CreateEventPage() {
  const [title, setTitle] = useState('')
  const [venue, setVenue] = useState('')
  const [date, setDate] = useState('')

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!title.trim() || !venue.trim() || !date) {
      setError('Please fill in title, venue, and date.')
      return
    }

    setLoading(true)
    try {
      await createEvent({
        title: title.trim(),
        venue: venue.trim(),
        date,
      })

      setTitle('')
      setVenue('')
      setDate('')
      setSuccess(true)
    } catch (err) {
      const message =
        err.response?.data?.error?.message ||
        err.message ||
        'Could not create event. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative mx-auto w-full max-w-2xl px-0 sm:px-2 md:max-w-xl lg:max-w-2xl">
      {/* Gradient glow behind the card */}
      <div
        className="pointer-events-none absolute inset-x-4 top-24 -z-10 h-64 rounded-full bg-violet-600/20 blur-3xl md:inset-x-auto md:left-1/2 md:w-[32rem] md:-translate-x-1/2"
        aria-hidden
      />

      <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/60 p-6 shadow-2xl shadow-violet-950/30 backdrop-blur-md sm:p-8 md:p-10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-500/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-violet-600/10 blur-2xl" />

        <header className="relative border-b border-slate-800/80 pb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">
            Organizer tools
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Create New Event
          </h1>
          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            Add and publish new events to SyncSeat
          </p>
        </header>

        {success && (
          <div
            className="relative mt-6 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
            role="status"
          >
            Event created successfully
          </div>
        )}

        {error && (
          <div
            className="relative mt-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            role="alert"
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="relative mt-8 flex flex-col gap-5"
          noValidate
        >
          <div>
            <label
              htmlFor="title"
              className="mb-1.5 block text-sm font-medium text-slate-200"
            >
              Event title
            </label>
            <div className="relative">
              <FieldIcon>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                  />
                </svg>
              </FieldIcon>
              <input
                id="title"
                name="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tech Conference 2026"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-3 pl-11 pr-4 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="venue"
              className="mb-1.5 block text-sm font-medium text-slate-200"
            >
              Venue
            </label>
            <div className="relative">
              <FieldIcon>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
              </FieldIcon>
              <input
                id="venue"
                name="venue"
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Hyderabad Convention Center"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-3 pl-11 pr-4 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="date"
              className="mb-1.5 block text-sm font-medium text-slate-200"
            >
              Date & time
            </label>
            <div className="relative">
              <FieldIcon>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
              </FieldIcon>
              <input
                id="date"
                name="date"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-3 pl-11 pr-4 text-slate-100 outline-none transition [color-scheme:dark] focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-800/50 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none sm:w-auto sm:min-w-[200px] sm:self-end"
          >
            {loading ? 'Creating...' : 'Create event'}
          </button>
        </form>
      </div>
    </div>
  )
}
