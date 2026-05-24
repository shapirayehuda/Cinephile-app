import { useEffect, useState } from 'react'

export function useMoviePoster(movie) {
  const [posterFailed, setPosterFailed] = useState(false)
  const showPoster =
    Boolean(movie?.poster && movie.poster !== 'N/A') && !posterFailed

  useEffect(() => {
    setPosterFailed(false)
  }, [movie?.id, movie?.poster])

  return {
    showPoster,
    onPosterError: () => setPosterFailed(true),
  }
}
