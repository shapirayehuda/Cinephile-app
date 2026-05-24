export default function MovieDetailSkeleton() {
  return (
    <div
      className="movie-detail-skeleton skeleton-shimmer-host"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading movie"
    >
      <span className="visually-hidden">Loading movie</span>
      <div className="skeleton-block movie-detail-skeleton__back" />
      <div className="movie-detail-skeleton__layout">
        <div className="skeleton-block movie-detail-skeleton__poster" />
        <div className="movie-detail-skeleton__content">
          <div className="skeleton-block movie-detail-skeleton__title" />
          <div className="skeleton-block movie-detail-skeleton__sub" />
          <div className="skeleton-block movie-detail-skeleton__plot" />
          <div className="skeleton-block movie-detail-skeleton__plot movie-detail-skeleton__plot--short" />
          <div className="movie-detail-skeleton__meta">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="skeleton-block movie-detail-skeleton__meta-line" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
