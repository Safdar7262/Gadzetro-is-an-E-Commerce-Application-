export default function Loader({ label = 'Loading...', fullPage = false }) {
  return (
    <div className={`ui-loader ${fullPage ? 'full' : ''}`} role="status">
      <span className="ui-spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
