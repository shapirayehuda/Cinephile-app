import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import VirtualMovieGrid from '../assets/components/VirtualMovieGrid'
import MovieGridSkeleton from '../assets/components/MovieGridSkeleton'
import MovieSortSelect from '../assets/components/MovieSortSelect'
import {
  initMovieFeed,
  fetchMovieFeedPage,
  searchTitleFirstPage,
  filterCardsByGenreAndCountry,
  enrichCardsWithRatings,
} from '../api/omdb'
import { useDiscovery } from '../context/DiscoveryContext'
import { sortMovies } from '../utils/sortMovies'

function mergeUniqueById(prev, next) {
  const seen = new Set(prev.map((m) => m.id))
  const added = []
  for (const m of next) {
    if (!m?.id || seen.has(m.id)) continue
    seen.add(m.id)
    added.push(m)
  }
  return [...prev, ...added]
}

export default function MoviesHomePage() {
  const { searchTrigger } = useDiscovery()
  const [movies, setMovies] = useState([])
  const [totalResults, setTotalResults] = useState(0)
  const [feedConfig, setFeedConfig] = useState(null)
  const [clientFiltered, setClientFiltered] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState('year-desc')

  const sortedMovies = useMemo(
    () => sortMovies(movies, sortBy),
    [movies, sortBy],
  )

  const nextPageRef = useRef(2)
  const loadingMoreRef = useRef(false)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      setError(null)
      setLoading(true)
      setClientFiltered(false)
      try {
        if (!searchTrigger) {
          const init = await initMovieFeed()
          if (cancelled) return
          setFeedConfig({ baseParams: init.baseParams, moviesOnly: init.moviesOnly })
          const withRatings = await enrichCardsWithRatings(init.movies)
          if (cancelled) return
          setMovies(withRatings)
          setTotalResults(init.totalResults)
          nextPageRef.current = 2
          return
        }

        const { query, year, genre, country } = searchTrigger
        const trimmedQuery = query.trim()
        const trimmedYear = year?.trim() || ''
        const selectedGenres = Array.isArray(genre)
          ? genre.map((g) => String(g || '').trim()).filter(Boolean)
          : []
        const trimmedCountry = country?.trim() || ''
        const hasAdvancedFilters = Boolean(trimmedYear || selectedGenres.length > 0 || trimmedCountry)

        if (!trimmedQuery && hasAdvancedFilters) {
          const yearSeeds = ['the', 'love', 'man', 'war', 'star', 'life', 'last', 'night']
          const yearPages = await Promise.all(
            yearSeeds.map((seed) =>
              searchTitleFirstPage(seed, {
                year: trimmedYear || undefined,
                softEmpty: true,
              }).catch(() => null),
            ),
          )
          if (cancelled) return

          let list = []
          for (const page of yearPages) {
            if (!page || !Array.isArray(page.movies)) continue
            list = mergeUniqueById(list, page.movies)
          }
          if (selectedGenres.length > 0 || trimmedCountry) {
            list = await filterCardsByGenreAndCountry(list, {
              genres: selectedGenres,
              country: trimmedCountry,
            })
          }
          if (cancelled) return

          setFeedConfig(null)
          setClientFiltered(true)
          setTotalResults(list.length)
          const withRatings = await enrichCardsWithRatings(list)
          if (cancelled) return
          setMovies(withRatings)
          nextPageRef.current = 2

          return
        }

        if (!trimmedQuery) {
          setMovies([])
          setFeedConfig(null)
          setTotalResults(0)
          return
        }

        const pageResult = await searchTitleFirstPage(trimmedQuery, {
          year: trimmedYear || undefined,
          softEmpty: true,
        })
        if (cancelled) return

        const hasDetailFilters =
          selectedGenres.length > 0 || Boolean(trimmedCountry)

        let list = pageResult.movies

        if (hasDetailFilters) {
          list = await filterCardsByGenreAndCountry(list, {
            genres: selectedGenres,
            country: trimmedCountry,
          })
          if (cancelled) return
          setFeedConfig(null)
          setTotalResults(list.length)
          setClientFiltered(true)
        } else {
          setFeedConfig({
            baseParams: pageResult.baseParams,
            moviesOnly: pageResult.moviesOnly,
          })
          setTotalResults(pageResult.totalResults)
        }

        const withRatings = await enrichCardsWithRatings(list)
        if (cancelled) return
        setMovies(withRatings)
        nextPageRef.current = 2

      } catch (e) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : 'Something went wrong'
          if (/too many results/i.test(msg)) {
            setError('Too many results. Add a movie title or narrow with year.')
          } else {
            setError(msg)
          }
          setMovies([])
          setFeedConfig(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [searchTrigger])

  const hasMore =
    feedConfig != null &&
    !clientFiltered &&
    movies.length < totalResults &&
    nextPageRef.current <= 100

  const loadMore = useCallback(async () => {
    if (!feedConfig || loadingMoreRef.current || clientFiltered) return
    if (movies.length >= totalResults || nextPageRef.current > 100) {
      return
    }

    loadingMoreRef.current = true
    setLoadingMore(true)

    const page = nextPageRef.current

    try {
      const { movies: pageMovies, totalResults: apiTotal } = await fetchMovieFeedPage(
        feedConfig.baseParams,
        feedConfig.moviesOnly,
        page,
      )

      nextPageRef.current = page + 1

      if (apiTotal > 0) {
        setTotalResults(apiTotal)
      }

      const pageWithRatings = await enrichCardsWithRatings(pageMovies)
      setMovies((prev) => mergeUniqueById(prev, pageWithRatings))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load more')
    } finally {
      loadingMoreRef.current = false
      setLoadingMore(false)
    }
  }, [feedConfig, movies.length, totalResults, clientFiltered])

  return (
    <div className="app-layout__main">
      {loading && <MovieGridSkeleton />}
      {!loading && error && (
        <p className="app-status app-status--error" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && movies.length === 0 && (
        <div className="app-empty">
          <p className="app-empty__title">No movies found</p>
          <p className="app-empty__hint">
            Try another title, add a year, or adjust your filters. If the list is very broad, OMDb may
            ask for a more specific search.
          </p>
        </div>
      )}
      {!loading && !error && movies.length > 0 && (
        <>
          <div className="movie-sort-bar">
            <MovieSortSelect
              id="discovery-movie-sort"
              value={sortBy}
              onChange={setSortBy}
            />
          </div>
          <VirtualMovieGrid
            movies={sortedMovies}
            hasMore={hasMore}
            loadingMore={loadingMore}
            onLoadMore={loadMore}
          />
        </>
      )}
    </div>
  )
}
