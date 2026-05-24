import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDiscovery } from '../../context/DiscoveryContext'

const GENRES = [
  '',
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'History',
  'Horror',
  'Music',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'War',
  'Western',
]

export default function HeaderSearch() {
  const { searchTrigger, submitSearch, resetToFeed } = useDiscovery()
  const navigate = useNavigate()
  const location = useLocation()
  const filterWrapRef = useRef(null)
  const searchTriggerRef = useRef(searchTrigger)
  searchTriggerRef.current = searchTrigger

  const [query, setQuery] = useState('')
  const [year, setYear] = useState('')
  const [genres, setGenres] = useState([])
  const [country, setCountry] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    if (!searchTrigger) {
      setQuery('')
      setYear('')
      setGenres([])
      setCountry('')
    }
  }, [searchTrigger])

  useEffect(() => {
    const id = window.setTimeout(() => {
      const q = query.trim()
      const hasFilters =
        Boolean(year.trim()) || genres.length > 0 || Boolean(country.trim())

      if (!q && !hasFilters) {
        if (searchTriggerRef.current !== null) {
          resetToFeed()
        }
        return
      }

      if (!q && hasFilters) {
        return
      }

      if (q.length > 0 && q.length < 2) {
        return
      }

      if (location.pathname !== '/') {
        navigate('/')
      }
      submitSearch({ query: q, year, genre: genres, country })
    }, 350)

    return () => window.clearTimeout(id)
  }, [query, year, genres, country, location.pathname, navigate, resetToFeed, submitSearch])

  useEffect(() => {
    function handleClickOutside(event) {
      if (!filterWrapRef.current?.contains(event.target)) {
        setFiltersOpen(false)
      }
    }

    function handleEsc(event) {
      if (event.key === 'Escape') {
        setFiltersOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    const q = query.trim()
    const hasAdvancedFilters =
      Boolean(year.trim()) || genres.length > 0 || Boolean(country.trim())

    if (!q && !hasAdvancedFilters) {
      resetToFeed()
      if (location.pathname !== '/') {
        navigate('/')
      }
      return
    }

    if (location.pathname !== '/') {
      navigate('/')
    }
    submitSearch({ query: q, year, genre: genres, country })
    setFiltersOpen(false)
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }

  return (
    <form className="header-search" onSubmit={handleSubmit}>
      <div className="header-search__field">
        <input
          type="search"
          className="header-search__input"
          placeholder="Search movies (updates as you type)…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search by movie title"
          autoComplete="off"
        />
        <div
          ref={filterWrapRef}
          className={`header-search__filter-wrap${filtersOpen ? ' header-search__filter-wrap--open' : ''}`}
        >
          <button
            type="button"
            className="header-search__chevron"
            aria-haspopup="true"
            aria-expanded={filtersOpen}
            aria-label="Open advanced search filters"
            onClick={() => setFiltersOpen((v) => !v)}
          >
            ▾
          </button>
          <div className="header-search__dropdown" role="group" aria-label="Extra search filters">
            <label className="header-search__label">
              Year
              <input
                type="number"
                className="header-search__small-input"
                placeholder="e.g. 2024"
                min="1890"
                max="2100"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </label>
            <label className="header-search__label">
              Genre
              <select
                className="header-search__select"
                multiple
                size={6}
                value={genres}
                onChange={(e) =>
                  setGenres(
                    Array.from(e.target.selectedOptions, (option) => option.value).filter(Boolean),
                  )
                }
              >
                {GENRES.map((g) => (
                  <option key={g || 'any'} value={g}>
                    {g || 'Any'}
                  </option>
                ))}
              </select>
            </label>
            <label className="header-search__label">
              Country
              <input
                type="text"
                className="header-search__small-input"
                placeholder="e.g. USA"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </label>
            <p className="header-search__hint">
              You can select multiple genres (Ctrl/Cmd + click). Filters can run together or separately.
            </p>
            <button type="submit" className="header-search__apply">
              Apply filters
            </button>
          </div>
        </div>
      </div>
      <button type="submit" className="header-search__submit">
        Search
      </button>
    </form>
  )
}
