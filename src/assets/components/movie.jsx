import { Link } from 'react-router-dom'
import WatchlistButton from './WatchlistButton'
import MoviePosterMedia from './MoviePosterMedia'
import '../movie.css'

export function MovieCard({ movie }) {
  return (
    <article className="movie-card">
      <WatchlistButton
        movie={movie}
        className="movie-card__watchlist"
        variant="compact"
      />
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
    </article>
  )
}
