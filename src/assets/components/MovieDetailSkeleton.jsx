import '../skeleton.css'

export default function MovieDetailSkeleton() {
  return (
    <div
      className="movie-detail-skeleton"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading movie"
    >
      <span className="visually-hidden">Loading movie</span>
      <div className="skeleton movie-detail-skeleton__back" />
      <div className="movie-detail-skeleton__layout">
        <div className="skeleton movie-detail-skeleton__poster" />
        <div className="movie-detail-skeleton__content">
          <div className="skeleton movie-detail-skeleton__title" />
          <div className="skeleton movie-detail-skeleton__sub" />
          <div className="skeleton movie-detail-skeleton__plot" />
          <div className="skeleton movie-detail-skeleton__plot movie-detail-skeleton__plot--short" />
          <div className="movie-detail-skeleton__meta">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="skeleton movie-detail-skeleton__meta-line" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
