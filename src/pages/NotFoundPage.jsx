import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="app-empty">
      <h1 className="app-empty__title">Page not found</h1>
      <p className="app-empty__hint">
        This URL does not match a page in Cinephile. Try the discovery feed or open a
        movie from the list.
      </p>
      <Link to="/" className="movie-detail__back">
        ← Back to discovery
      </Link>
    </main>
  )
}
