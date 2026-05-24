import { Link } from 'react-router-dom'
import { useWatchlist } from '../../context/WatchlistContext'
import MoviePosterMedia from './MoviePosterMedia'
import '../movie.css'

export default function WatchlistCard({ movie }) {
  const { removeFromWatchlist } = useWatchlist()

  return (
    <article className="movie-card watchlist-card">
      <Link
        className="movie-card__link"
        to={`/movie/${encodeURIComponent(movie.id)}`}
      >
        <MoviePosterMedia movie={movie} />
        <div className="movie-card__body">
          <h3 className="movie-card__title">{movie.title}</h3>
          <p>Year: {movie.year}</p>
          <p>Rating: {movie.rating ?? '—'}</p>
        </div>
      </Link>
      <button
        type="button"
        className="watchlist-card__remove"
        onClick={() => removeFromWatchlist(movie.id)}
        aria-label={`Remove ${movie.title} from watchlist`}
      >
        <span className="watchlist-card__remove-icon" aria-hidden="true">
          ×
        </span>
        Remove
      </button>
    </article>
  )
}
