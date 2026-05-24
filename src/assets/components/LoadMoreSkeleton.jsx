import MovieCardSkeleton from './MovieCardSkeleton'
import '../movie.css'
import '../skeleton.css'

export default function LoadMoreSkeleton() {
  return (
    <div
      className="virtuoso-footer load-more-skeleton"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading more movies"
    >
      <span className="visually-hidden">Loading more movies</span>
      <ul className="virtuoso-movie-list load-more-skeleton__list">
        {Array.from({ length: 2 }, (_, i) => (
          <li key={i} className="virtuoso-movie-item">
            <MovieCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  )
}
