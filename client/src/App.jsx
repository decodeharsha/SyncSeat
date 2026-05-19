/**
 * Root app component — currently delegates to the router.
 *
 * If you add global providers that do not belong in `main.jsx`, compose them
 * here (e.g. theme, query client) above `<AppRouter />`.
 */

import { AppRouter } from './routes/AppRouter.jsx'

export default function App() {
  return <AppRouter />
}
