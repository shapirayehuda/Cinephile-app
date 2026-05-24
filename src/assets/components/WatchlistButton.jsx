import { useWatchlist } from '../../context/WatchlistContext'

export default function WatchlistButton({ movie, className = '' }) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const id = movie?.id ?? movie?.imdbID
  const inList = id ? isInWatchlist(id) : false

  function handleClick(event) {
    event.preventDefault()
    event.stopPropagation()
    toggleWatchlist(movie)
  }

  return (
    <button
      type="button"
      className={`watchlist-btn${inList ? ' watchlist-btn--active' : ''}${className ? ` ${className}` : ''}`}
      onClick={handleClick}
      aria-label={inList ? 'Remove from watchlist' : 'Add to watchlist'}
      aria-pressed={inList}
    >
      {inList ? 'In watchlist' : 'Add to watchlist'}
    </button>
  )
}
