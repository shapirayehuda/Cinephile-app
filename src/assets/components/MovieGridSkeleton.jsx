import MovieCardSkeleton from './MovieCardSkeleton'
import '../movie.css'
import '../skeleton.css'

export default function MovieGridSkeleton({ count = 8, label = 'Loading movies' }) {
  return (
    <div
      className="movie-grid-skeleton"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
    >
      <span className="visually-hidden">{label}</span>
      <ul className="virtuoso-movie-list movie-grid-skeleton__list">
        {Array.from({ length: count }, (_, i) => (
          <li key={i} className="virtuoso-movie-item">
            <MovieCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  )
}
