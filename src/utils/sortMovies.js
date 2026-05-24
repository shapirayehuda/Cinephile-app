export const MOVIE_SORT_OPTIONS = [
  { value: 'year-desc', label: 'Year (newest)' },
  { value: 'year-asc', label: 'Year (oldest)' },
  { value: 'rating-desc', label: 'Rating (high–low)' },
  { value: 'rating-asc', label: 'Rating (low–high)' },
  { value: 'title-asc', label: 'Title (A–Z)' },
  { value: 'title-desc', label: 'Title (Z–A)' },
]

function yearSortValue(yearStr) {
  if (!yearStr || yearStr === 'N/A') return 0
  const years = yearStr.match(/\d{4}/g)
  if (!years) return 0
  return Math.max(...years.map(Number))
}

function ratingSortValue(rating) {
  if (rating == null || rating === '' || rating === '—') return -1
  const n = Number.parseFloat(String(rating))
  return Number.isFinite(n) ? n : -1
}

/** @param {Array<{ id: string, title: string, year: string, rating?: string | null }>} movies */
export function sortMovies(movies, sortKey = 'year-desc') {
  const list = [...movies]

  switch (sortKey) {
    case 'year-asc':
      return list.sort((a, b) => yearSortValue(a.year) - yearSortValue(b.year))
    case 'rating-desc':
      return list.sort(
        (a, b) =>
          ratingSortValue(b.rating) - ratingSortValue(a.rating) ||
          a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }),
      )
    case 'rating-asc':
      return list.sort(
        (a, b) =>
          ratingSortValue(a.rating) - ratingSortValue(b.rating) ||
          a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }),
      )
    case 'title-asc':
      return list.sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }),
      )
    case 'title-desc':
      return list.sort((a, b) =>
        b.title.localeCompare(a.title, undefined, { sensitivity: 'base' }),
      )
    case 'year-desc':
    default:
      return list.sort((a, b) => yearSortValue(b.year) - yearSortValue(a.year))
  }
}

/** @param {Array<{ id: string, title: string, year: string }>} movies */
export function sortMoviesNewestFirst(movies) {
  return sortMovies(movies, 'year-desc')
}
