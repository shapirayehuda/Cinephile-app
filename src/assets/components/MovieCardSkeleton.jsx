import '../skeleton.css'

export default function MovieCardSkeleton() {
  return (
    <article className="movie-card movie-card-skeleton" aria-hidden="true">
      <div className="movie-card-skeleton__poster skeleton" />
      <div className="movie-card-skeleton__body">
        <div className="skeleton movie-card-skeleton__title" />
        <div className="skeleton movie-card-skeleton__line" />
        <div className="skeleton movie-card-skeleton__line movie-card-skeleton__line--short" />
      </div>
    </article>
  )
}
