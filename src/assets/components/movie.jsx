import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../movie.css'

export function MovieCard({ movie }) {
  const [posterFailed, setPosterFailed] = useState(false)
  const showPoster =
    Boolean(movie.poster && movie.poster !== 'N/A') && !posterFailed

  useEffect(() => {
    setPosterFailed(false)
  }, [movie.id, movie.poster])

  return (
    <Link className="movie-card movie-card--link" to={`/movie/${encodeURIComponent(movie.id)}`}>
      <div className="movie-card__media">
        {showPoster ? (
          <img
            src={movie.poster}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setPosterFailed(true)}
          />
        ) : (
          <span className="movie-card__placeholder" aria-hidden>
            No poster
          </span>
        )}
      </div>
      <div className="movie-card__body">
        <h3 className="movie-card__title">{movie.title}</h3>
        <p>Year: {movie.year}</p>
        <p>Rating: {movie.rating ?? '—'}</p>
      </div>
    </Link>
  )
}
