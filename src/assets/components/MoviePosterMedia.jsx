import { useMoviePoster } from '../../hooks/useMoviePoster'

export default function MoviePosterMedia({ movie }) {
  const { showPoster, onPosterError } = useMoviePoster(movie)

  return (
    <div className="movie-card__media">
      {showPoster ? (
        <img
          src={movie.poster}
          alt=""
          loading="lazy"
          decoding="async"
          onError={onPosterError}
        />
      ) : (
        <span className="movie-card__placeholder" aria-hidden>
          No poster
        </span>
      )}
    </div>
  )
}
