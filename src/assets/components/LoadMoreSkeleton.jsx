import MovieCardSkeleton from './MovieCardSkeleton'
import '../movie.css'

export default function LoadMoreSkeleton() {
  return (
    <div
      className="virtuoso-footer load-more-skeleton skeleton-shimmer-host"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading more movies"
    >
      <span className="visually-hidden">Loading more movies</span>
      <ul className="virtuoso-movie-list load-more-skeleton__list">
        <li className="virtuoso-movie-item">
          <MovieCardSkeleton />
        </li>
      </ul>
    </div>
  )
}
