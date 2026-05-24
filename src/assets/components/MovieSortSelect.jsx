import { MOVIE_SORT_OPTIONS } from '../../utils/sortMovies'

export default function MovieSortSelect({ value, onChange, id = 'movie-sort' }) {
  return (
    <div className="movie-sort">
      <label className="movie-sort__label" htmlFor={id}>
        Sort by
      </label>
      <select
        id={id}
        className="movie-sort__select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Sort movies"
      >
        {MOVIE_SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
