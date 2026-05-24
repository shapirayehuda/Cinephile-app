export default function MovieCardSkeleton() {
  return (
    <article className="movie-card movie-card-skeleton" aria-hidden="true">
      <div className="movie-card-skeleton__poster skeleton-block" />
      <div className="movie-card-skeleton__body">
        <div className="skeleton-block movie-card-skeleton__title" />
        <div className="skeleton-block movie-card-skeleton__line" />
        <div className="skeleton-block movie-card-skeleton__line movie-card-skeleton__line--short" />
      </div>
    </article>
  )
}
