import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MovieCard } from '../assets/components/movie'
import { useWatchlist } from '../context/WatchlistContext'

export default function WatchlistPage() {
  const { watchlist } = useWatchlist()

  useEffect(() => {
    document.title = `Watchlist · Cinephile`
    return () => {
      document.title = 'cinephile-app'
    }
  }, [])

  return (
    <div className="app-layout__main watchlist-page">
      <header className="watchlist-page__header">
        <h2 className="watchlist-page__title">Your watchlist</h2>
        <p className="watchlist-page__meta">
          {watchlist.length === 0
            ? 'Saved on this device — add movies from discovery or a movie page.'
            : `${watchlist.length} saved ${watchlist.length === 1 ? 'movie' : 'movies'}`}
        </p>
      </header>

      {watchlist.length === 0 ? (
        <div className="app-empty">
          <p className="app-empty__title">Watchlist is empty</p>
          <p className="app-empty__hint">
            Use &quot;Add to watchlist&quot; on any movie card or movie page. Your list stays here
            when you reload the site.
          </p>
          <Link to="/" className="movie-detail__back">
            ← Browse movies
          </Link>
        </div>
      ) : (
        <ul className="virtuoso-movie-list watchlist-page__grid">
          {watchlist.map((movie) => (
            <li key={movie.id} className="virtuoso-movie-item">
              <MovieCard movie={movie} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
