import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchMovieByImdbId } from '../api/omdb'
import AppLoader from '../assets/components/AppLoader'
import WatchlistButton from '../assets/components/WatchlistButton'
import './movie-detail.css'

function disp(v) {
  if (v == null || v === '' || v === 'N/A') return '—'
  return String(v)
}

export default function MovieDetailPage() {
  const { imdbId: imdbIdParam } = useParams()
  const imdbId = imdbIdParam ? decodeURIComponent(imdbIdParam) : ''
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [posterBroken, setPosterBroken] = useState(false)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      setError(null)
      setDetail(null)
      setPosterBroken(false)
      setLoading(true)
      if (!imdbId) {
        setError('Missing movie id')
        setLoading(false)
        return
      }
      try {
        const data = await fetchMovieByImdbId(imdbId)
        if (!cancelled) setDetail(data)
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load movie')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [imdbId])

  useEffect(() => {
    if (detail?.Title) {
      document.title = `${detail.Title} · Cinephile`
      return
    }
    if (imdbId) {
      document.title = `${imdbId} · Cinephile`
    }
    return () => {
      document.title = 'cinephile-app'
    }
  }, [detail, imdbId])

  if (loading) {
    return (
      <main className="movie-detail movie-detail--centered">
        <AppLoader label="Loading movie…" />
      </main>
    )
  }

  if (error || !detail) {
    return (
      <main className="movie-detail">
        <Link to="/" className="movie-detail__back">
          ← Back to discovery
        </Link>
        <p className="movie-detail__status movie-detail__status--error" role="alert">
          {error || 'Movie not found'}
        </p>
      </main>
    )
  }

  const posterOk = detail.Poster && detail.Poster !== 'N/A' && !posterBroken
  const ratings = Array.isArray(detail.Ratings) ? detail.Ratings : []
  const castList =
    detail.Actors && detail.Actors !== 'N/A'
      ? detail.Actors.split(',').map((s) => s.trim()).filter(Boolean)
      : []

  return (
    <main className="movie-detail">
      {detail.Poster && detail.Poster !== 'N/A' && !posterBroken && (
        <div className="movie-detail__backdrop" aria-hidden>
          <img
            className="movie-detail__backdrop-img"
            src={detail.Poster}
            alt=""
            onError={() => setPosterBroken(true)}
          />
          <div className="movie-detail__backdrop-scrim" />
        </div>
      )}

      <div className="movie-detail__content">
        <Link to="/" className="movie-detail__back">
          ← Back to discovery
        </Link>

        <div className="movie-detail__layout">
          <div className="movie-detail__poster-wrap">
            {posterOk ? (
              <img
                className="movie-detail__poster"
                src={detail.Poster}
                alt=""
                onError={() => setPosterBroken(true)}
              />
            ) : (
              <div className="movie-detail__poster-placeholder">No poster</div>
            )}
          </div>

          <div>
          <div className="movie-detail__title-row">
            <h1 className="movie-detail__title">{disp(detail.Title)}</h1>
            <WatchlistButton movie={detail} />
          </div>
          <p className="movie-detail__sub">
            {disp(detail.Year)} · {disp(detail.Type)} · {disp(detail.Runtime)}
          </p>

          {detail.Plot && detail.Plot !== 'N/A' && (
            <p className="movie-detail__plot">{detail.Plot}</p>
          )}

          {castList.length > 0 && (
            <section className="movie-detail__cast" aria-label="Cast">
              <h2 className="movie-detail__cast-title">Cast</h2>
              <ul className="movie-detail__cast-list">
                {castList.map((name) => (
                  <li key={name} className="movie-detail__cast-item">
                    {name}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <dl className="movie-detail__meta">
            <dt>Rated</dt>
            <dd>{disp(detail.Rated)}</dd>

            <dt>Released</dt>
            <dd>{disp(detail.Released)}</dd>

            <dt>Genre</dt>
            <dd>{disp(detail.Genre)}</dd>

            <dt>Director</dt>
            <dd>{disp(detail.Director)}</dd>

            <dt>Writer</dt>
            <dd>{disp(detail.Writer)}</dd>

            <dt>Language</dt>
            <dd>{disp(detail.Language)}</dd>

            <dt>Country</dt>
            <dd>{disp(detail.Country)}</dd>

            <dt>Awards</dt>
            <dd>{disp(detail.Awards)}</dd>

            <dt>Metascore</dt>
            <dd>{disp(detail.Metascore)}</dd>

            <dt>IMDb rating</dt>
            <dd>
              {disp(detail.imdbRating)}
              {detail.imdbVotes && detail.imdbVotes !== 'N/A' && (
                <span> ({disp(detail.imdbVotes)} votes)</span>
              )}
            </dd>

            <dt>IMDb ID</dt>
            <dd>{disp(detail.imdbID)}</dd>

            <dt>Box office</dt>
            <dd>{disp(detail.BoxOffice)}</dd>

            <dt>DVD</dt>
            <dd>{disp(detail.DVD)}</dd>

            <dt>Production</dt>
            <dd>{disp(detail.Production)}</dd>

            <dt>Website</dt>
            <dd>
              {detail.Website && detail.Website !== 'N/A' ? (
                <a href={detail.Website} target="_blank" rel="noopener noreferrer">
                  {detail.Website}
                </a>
              ) : (
                '—'
              )}
            </dd>

            {ratings.length > 0 && (
              <>
                <dt className="movie-detail__ratings-label">Ratings</dt>
                <dd className="movie-detail__ratings">
                  <ul>
                    {ratings.map((r) => (
                      <li key={`${r.Source}-${r.Value}`}>
                        <strong>{r.Source}:</strong> {r.Value}
                      </li>
                    ))}
                  </ul>
                </dd>
              </>
            )}
          </dl>
          </div>
        </div>
      </div>
    </main>
  )
}
