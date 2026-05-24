/**
 * Accessible loading indicator (spinner + label).
 * @param {{ label?: string }} props
 */
export default function AppLoader({ label = 'Loading…' }) {
  return (
    <div className="app-loader" role="status" aria-live="polite" aria-busy="true">
      <div className="app-loader__spinner" aria-hidden />
      <span className="app-loader__label">{label}</span>
    </div>
  )
}
