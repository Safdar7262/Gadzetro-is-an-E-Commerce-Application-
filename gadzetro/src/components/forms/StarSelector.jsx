import { FaStar, FaRegStar } from 'react-icons/fa'

export default function StarSelector({ value, onChange, error }) {
  return (
    <div className="star-selector">
      <div role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={value === n} aria-label={`${n} star${n > 1 ? 's' : ''}`} onClick={() => onChange(n)}>
            {n <= value ? <FaStar /> : <FaRegStar />}
          </button>
        ))}
      </div>
      {error && <p className="ui-field-error" role="alert">{error}</p>}
    </div>
  )
}
