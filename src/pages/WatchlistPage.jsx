import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import WatchlistCard from '../assets/components/WatchlistCard'
import MovieSortSelect from '../assets/components/MovieSortSelect'
import { useWatchlist } from '../context/WatchlistContext'
import { sortMovies } from '../utils/sortMovies'

export default function WatchlistPage() {
  const { watchlist, clearWatchlist } = useWatchlist()
  const [sortBy, setSortBy] = useState('year-desc')

  const sortedWatchlist = useMemo(
    () => sortMovies(watchlist, sortBy),
    [watchlist, sortBy],
  )

  useEffect(() => {
    document.title = `Watchlist · Cinephile`
    return () => {
      document.title = 'cinephile-app'
    }
  }, [])

  function handleClearAll() {
    if (watchlist.length === 0) return
    const ok = window.confirm(
      `Remove all ${watchlist.length} movies from your watchlist?`,
    )
    if (ok) clearWatchlist()
  }

  return (
    <div className="app-layout__main watchlist-page">
      <header className="watchlist-page__header">
        <div className="watchlist-page__heading">
          <h2 className="watchlist-page__title">Your watchlist</h2>
          <p className="watchlist-page__meta">
            {watchlist.length === 0
              ? 'Saved on this device — add movies from discovery or a movie page.'
              : `${watchlist.length} saved ${watchlist.length === 1 ? 'movie' : 'movies'}`}
          </p>
        </div>
        {watchlist.length > 0 && (
          <button
            type="button"
            className="watchlist-page__clear"
            onClick={handleClearAll}
          >
            Clear all
          </button>
        )}
      </header>

      {watchlist.length === 0 ? (
        <div className="app-empty">
          <p className="app-empty__title">Watchlist is empty</p>
          <p className="app-empty__hint">
            Use the bookmark button on any movie card or movie page. Your list stays here
            when you reload the site.
          </p>
          <Link to="/" className="movie-detail__back">
            ← Browse movies
          </Link>
        </div>
      ) : (
        <>
          <div className="movie-sort-bar movie-sort-bar--watchlist">
            <MovieSortSelect
              id="watchlist-movie-sort"
              value={sortBy}
              onChange={setSortBy}
            />
          </div>
          <ul className="virtuoso-movie-list watchlist-page__grid">
            {sortedWatchlist.map((movie) => (
              <li key={movie.id} className="virtuoso-movie-item">
                <WatchlistCard movie={movie} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
