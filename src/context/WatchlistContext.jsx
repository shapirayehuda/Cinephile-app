import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'cinephile-watchlist'

const WatchlistContext = createContext(undefined)

function loadWatchlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((m) => m && typeof m.id === 'string' && m.id.length > 0)
  } catch {
    return []
  }
}

export function normalizeWatchlistMovie(movie) {
  const id = movie?.id ?? movie?.imdbID
  if (!id) return null

  const poster = movie?.poster ?? movie?.Poster
  const ratingRaw = movie?.rating ?? movie?.imdbRating

  return {
    id: String(id),
    title: String(movie?.title ?? movie?.Title ?? 'Untitled'),
    year: String(movie?.year ?? movie?.Year ?? '—'),
    poster: poster && poster !== 'N/A' ? String(poster) : null,
    rating:
      ratingRaw != null && ratingRaw !== '' && ratingRaw !== 'N/A'
        ? String(ratingRaw)
        : null,
  }
}

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState(loadWatchlist)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist))
  }, [watchlist])

  const isInWatchlist = useCallback(
    (id) => watchlist.some((m) => m.id === id),
    [watchlist],
  )

  const addToWatchlist = useCallback((movie) => {
    const entry = normalizeWatchlistMovie(movie)
    if (!entry) return
    setWatchlist((prev) => {
      if (prev.some((m) => m.id === entry.id)) return prev
      return [entry, ...prev]
    })
  }, [])

  const removeFromWatchlist = useCallback((id) => {
    setWatchlist((prev) => prev.filter((m) => m.id !== id))
  }, [])

  const toggleWatchlist = useCallback((movie) => {
    const entry = normalizeWatchlistMovie(movie)
    if (!entry) return
    setWatchlist((prev) => {
      if (prev.some((m) => m.id === entry.id)) {
        return prev.filter((m) => m.id !== entry.id)
      }
      return [entry, ...prev]
    })
  }, [])

  const clearWatchlist = useCallback(() => {
    setWatchlist([])
  }, [])

  const value = useMemo(
    () => ({
      watchlist,
      watchlistCount: watchlist.length,
      isInWatchlist,
      addToWatchlist,
      removeFromWatchlist,
      toggleWatchlist,
      clearWatchlist,
    }),
    [
      watchlist,
      isInWatchlist,
      addToWatchlist,
      removeFromWatchlist,
      toggleWatchlist,
      clearWatchlist,
    ],
  )

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext)
  if (ctx === undefined) {
    throw new Error('useWatchlist must be used within WatchlistProvider')
  }
  return ctx
}
