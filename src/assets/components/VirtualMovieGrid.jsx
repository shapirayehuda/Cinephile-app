import { useCallback } from 'react'
import { VirtuosoGrid } from 'react-virtuoso'
import { MovieCard } from './movie'
import '../movie.css'

/**
 * @param {object} props
 * @param {Array<{ id: string, title: string, year: string, poster: string, rating: string | null }>} props.movies
 * @param {boolean} props.hasMore
 * @param {boolean} props.loadingMore
 * @param {() => void} props.onLoadMore
 */
export default function VirtualMovieGrid({ movies, hasMore, loadingMore, onLoadMore }) {
  const maybeLoadMore = useCallback(() => {
    if (hasMore && !loadingMore) {
      onLoadMore()
    }
  }, [hasMore, loadingMore, onLoadMore])

  const rangeChanged = useCallback(
    ({ endIndex }) => {
      if (movies.length === 0) return
      if (endIndex >= movies.length - 1) {
        maybeLoadMore()
      }
    },
    [movies.length, maybeLoadMore],
  )

  return (
    <VirtuosoGrid
      style={{ height: '100%', width: '100%', minHeight: 0 }}
      data={movies}
      computeItemKey={(_, movie) => movie.id}
      endReached={maybeLoadMore}
      rangeChanged={rangeChanged}
      increaseViewportBy={{ bottom: 360, top: 120 }}
      listClassName="virtuoso-movie-list"
      itemClassName="virtuoso-movie-item"
      itemContent={(_index, movie) => <MovieCard movie={movie} />}
      components={{
        Footer: () =>
          loadingMore ? (
            <div className="virtuoso-footer virtuoso-footer--loading" role="status" aria-live="polite">
              <div className="app-loader__spinner app-loader__spinner--inline" aria-hidden />
              <span>Loading more…</span>
            </div>
          ) : !hasMore && movies.length > 0 ? (
            <p className="virtuoso-footer virtuoso-footer--muted">No more results</p>
          ) : null,
      }}
    />
  )
}
