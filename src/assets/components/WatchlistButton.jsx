import { useWatchlist } from '../../context/WatchlistContext'

function BookmarkIcon({ filled }) {
  return (
    <svg
      className="watchlist-btn__icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {filled ? (
        <path
          fill="currentColor"
          d="M6 2a2 2 0 0 0-2 2v18l8-4.5 8 4.5V4a2 2 0 0 0-2-2H6z"
        />
      ) : (
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          d="M6 2a2 2 0 0 0-2 2v18l8-4.5 8 4.5V4a2 2 0 0 0-2-2H6z"
        />
      )}
    </svg>
  )
}

export default function WatchlistButton({ movie, className = '', variant = 'default' }) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const id = movie?.id ?? movie?.imdbID
  const inList = id ? isInWatchlist(id) : false
  const isCompact = variant === 'compact'

  function handleClick(event) {
    event.preventDefault()
    event.stopPropagation()
    toggleWatchlist(movie)
  }

  return (
    <button
      type="button"
      className={`watchlist-btn${inList ? ' watchlist-btn--active' : ''}${isCompact ? ' watchlist-btn--compact' : ''}${className ? ` ${className}` : ''}`}
      onClick={handleClick}
      aria-label={inList ? 'Remove from watchlist' : 'Add to watchlist'}
      aria-pressed={inList}
      title={inList ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      <BookmarkIcon filled={inList} />
      {!isCompact && (
        <span className="watchlist-btn__label">
          {inList ? 'Saved' : 'Watchlist'}
        </span>
      )}
    </button>
  )
}
