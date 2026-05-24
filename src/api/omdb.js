const OMDB_BASE = 'https://www.omdbapi.com/'

function getApiKey() {
  const raw = import.meta.env.VITE_OMDB_API_KEY
  const apiKey = typeof raw === 'string' ? raw.trim() : ''
  if (!apiKey) {
    throw new Error(
      'Add VITE_OMDB_API_KEY to your .env file. Get a free key at https://www.omdbapi.com/',
    )
  }
  return apiKey
}

/**
 * @param {Record<string, string>} params
 */
async function omdbSearch(params) {
  const url = new URL(OMDB_BASE)
  url.searchParams.set('apikey', getApiKey())
  url.searchParams.set('r', 'json')
  for (const [key, value] of Object.entries(params)) {
    if (value != null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  }

  const res = await fetch(url.toString())
  const text = await res.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = null
  }

  if (!res.ok) {
    const apiErr = data && typeof data.Error === 'string' ? data.Error : ''
    if (/limit reached|maximum number|daily|quota/i.test(apiErr)) {
      throw new Error(
        `OMDb: ${apiErr} Free keys have a daily cap — try again tomorrow, or use a new key from https://www.omdbapi.com/apikey.aspx`,
      )
    }
    if (res.status === 401 || res.status === 403) {
      const hint = apiErr ? ` (${apiErr})` : ''
      throw new Error(
        `OMDb returned ${res.status}${hint}. Check VITE_OMDB_API_KEY in .env (no space after =), activate the key via email, then restart npm run dev. https://www.omdbapi.com/apikey.aspx`,
      )
    }
    throw new Error(apiErr || `OMDb request failed (${res.status}). Try again in a moment.`)
  }

  if (!data) {
    throw new Error('OMDb returned an empty or invalid response.')
  }
  return data
}

/**
 * @param {object} data
 * @param {{ moviesOnly?: boolean }} [options]
 */
function toMovieList(data, options = {}) {
  const { moviesOnly = false } = options
  if (data.Response === 'False') {
    return null
  }
  if (!Array.isArray(data.Search)) {
    return []
  }
  const rows = data.Search.filter((item) => !moviesOnly || item.Type === 'movie').map((item) => ({
    id: item.imdbID,
    title: item.Title,
    year: item.Year,
    poster: item.Poster,
    rating: null,
  }))
  const seen = new Set()
  return rows.filter((m) => {
    if (!m.id || seen.has(m.id)) return false
    seen.add(m.id)
    return true
  })
}

import { sortMoviesNewestFirst } from '../utils/sortMovies.js'

export { sortMoviesNewestFirst }

/**
 * First page of title search (movies only). Use fetchMovieFeedPage for page 2+.
 * @param {string} query
 * @param {{ year?: string, softEmpty?: boolean }} [options] If softEmpty, non-fatal empty responses return an empty list instead of throwing.
 */
export async function searchTitleFirstPage(query, options = {}) {
  const softEmpty = options.softEmpty === true
  const q = query.trim()
  if (!q) {
    throw new Error('Enter a movie title')
  }

  /** @type {Record<string, string>} */
  const params = { s: q, type: 'movie' }
  const y = options.year != null ? String(options.year).trim() : ''
  if (y) {
    params.y = y
  }

  const data = await omdbSearch({ ...params, page: '1' })

  if (data.Response === 'False') {
    const err = data.Error || 'No results found'
    if (isFatalKeyError(err)) {
      throw new Error(
        `${err} Save .env and fully restart the dev server (Vite reads env only on startup).`,
      )
    }
    if (softEmpty && !/too many results/i.test(err)) {
      return {
        baseParams: { ...params },
        moviesOnly: true,
        movies: [],
        totalResults: 0,
      }
    }
    throw new Error(err)
  }

  const list = toMovieList(data, { moviesOnly: true })
  const totalResults = Number.parseInt(String(data.totalResults ?? '0'), 10)
  const total = Number.isFinite(totalResults) && totalResults > 0 ? totalResults : list.length

  return {
    baseParams: { ...params },
    moviesOnly: true,
    movies: sortMoviesNewestFirst(list),
    totalResults: total,
  }
}

/**
 * OMDb search has no genre/country params — filter by fetching details (batched).
 * @param {Array<{ id: string, title: string, year: string, poster: string, rating: null }>} cards
 * @param {{ genres?: string[], country?: string }} filters
 */
export async function filterCardsByGenreAndCountry(cards, filters) {
  const genres = Array.isArray(filters.genres)
    ? filters.genres.map((g) => String(g || '').trim().toLowerCase()).filter(Boolean)
    : []
  const country = (filters.country || '').trim().toLowerCase()
  if (genres.length === 0 && !country) {
    return cards
  }

  const out = []
  const batch = 4
  for (let i = 0; i < cards.length; i += batch) {
    const slice = cards.slice(i, i + batch)
    const details = await Promise.all(
      slice.map((m) =>
        fetchMovieByImdbId(m.id).catch(() => null),
      ),
    )
    for (let j = 0; j < slice.length; j++) {
      const d = details[j]
      if (!d) continue
      const g = (d.Genre || '').toLowerCase()
      const co = (d.Country || '').toLowerCase()
      const genreOk = genres.length === 0 || genres.some((genre) => g.includes(genre))
      const countryOk = !country || co.includes(country)
      if (genreOk && countryOk) {
        out.push(slice[j])
      }
    }
  }
  return sortMoviesNewestFirst(out)
}

/**
 * Enrich list cards with IMDb rating by fetching details in batches.
 * @param {Array<{ id: string, title: string, year: string, poster: string, rating: string | null }>} cards
 * @param {{ batchSize?: number }} [options]
 */
export async function enrichCardsWithRatings(cards, options = {}) {
  if (!Array.isArray(cards) || cards.length === 0) return []

  const batchSize = Number.isFinite(options.batchSize) && options.batchSize > 0
    ? Number(options.batchSize)
    : 4

  const output = [...cards]
  for (let i = 0; i < output.length; i += batchSize) {
    const slice = output.slice(i, i + batchSize)
    const details = await Promise.all(
      slice.map((card) => fetchMovieByImdbId(card.id).catch(() => null)),
    )

    for (let j = 0; j < slice.length; j += 1) {
      const detail = details[j]
      if (!detail) continue
      const imdbRating =
        detail.imdbRating && detail.imdbRating !== 'N/A'
          ? String(detail.imdbRating)
          : null
      output[i + j] = { ...output[i + j], rating: imdbRating }
    }
  }

  return output
}

function isFatalKeyError(message) {
  return /invalid api key|incorrect imdb id|not authorized|401/i.test(message)
}

function buildFeedAttempts() {
  const year = new Date().getFullYear()
  const titles = ['the', 'love', 'man', 'war', 'star', 'life', 'last', 'night']
  /** @type {Record<string, string>[]} */
  const attempts = []
  for (const s of titles) {
    attempts.push({ s, type: 'movie', y: String(year) })
    attempts.push({ s, type: 'movie', y: String(year - 1) })
    attempts.push({ s, type: 'movie', y: String(year - 2) })
    attempts.push({ s, type: 'movie' })
    attempts.push({ s, y: String(year) })
    attempts.push({ s, y: String(year - 1) })
    attempts.push({ s })
  }
  return attempts
}

/**
 * First successful search: params to reuse with `page`, first page of movies, total hit count.
 */
export async function initMovieFeed() {
  let lastOmdbError = null

  for (const params of buildFeedAttempts()) {
    const data = await omdbSearch({ ...params, page: '1' })

    if (data.Response === 'False') {
      const err = data.Error || 'Unknown error'
      lastOmdbError = err
      if (isFatalKeyError(err)) {
        throw new Error(
          `${err} Save .env and fully restart the dev server (Vite reads env only on startup).`,
        )
      }
      continue
    }

    const moviesOnly = !params.type
    const list = toMovieList(data, { moviesOnly })
    if (list.length === 0) {
      continue
    }

    const totalResults = Number.parseInt(String(data.totalResults ?? '0'), 10)
    const total = Number.isFinite(totalResults) && totalResults > 0 ? totalResults : list.length

    return {
      baseParams: { ...params },
      moviesOnly,
      movies: sortMoviesNewestFirst(list),
      totalResults: total,
    }
  }

  const suffix = lastOmdbError ? ` ${lastOmdbError}` : ''
  throw new Error(
    `Could not load movies from OMDb.${suffix} If your key is new, confirm the activation email from OMDb.`,
  )
}

/**
 * @param {Record<string, string>} baseParams same as init (no page)
 * @param {boolean} moviesOnly
 * @param {number} page 1-based (OMDb)
 */
export async function fetchMovieFeedPage(baseParams, moviesOnly, page) {
  const data = await omdbSearch({ ...baseParams, page: String(page) })

  if (data.Response === 'False') {
    throw new Error(data.Error || 'OMDb error')
  }

  const list = toMovieList(data, { moviesOnly })
  const totalResults = Number.parseInt(String(data.totalResults ?? '0'), 10)
  const total = Number.isFinite(totalResults) && totalResults > 0 ? totalResults : list.length

  return { movies: sortMoviesNewestFirst(list), totalResults: total }
}

/**
 * Full title / episode details by IMDb id (includes plot, cast, ratings, etc.).
 * @param {string} imdbId e.g. tt3896198
 */
export async function fetchMovieByImdbId(imdbId) {
  const id = String(imdbId || '').trim()
  if (!/^tt\d+$/i.test(id)) {
    throw new Error('Invalid IMDb id')
  }

  const data = await omdbSearch({ i: id, plot: 'full' })

  if (data.Response === 'False') {
    const err = data.Error || 'Movie not found'
    if (isFatalKeyError(err)) {
      throw new Error(
        `${err} Save .env and fully restart the dev server (Vite reads env only on startup).`,
      )
    }
    throw new Error(err)
  }

  return data
}
