import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'

export default function Rating({ value, count, showValue = true }) {
  return (
    <span className="ui-rating">
      <span className="ui-stars" role="img" aria-label={`${value} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((n) => {
          if (value >= n) return <FaStar key={n} />
          if (value >= n - 0.5) return <FaStarHalfAlt key={n} />
          return <FaRegStar key={n} />
        })}
      </span>
      {showValue && <strong>{value}</strong>}
      {count !== undefined && <span className="ui-rating-count">({count.toLocaleString('en-IN')})</span>}
    </span>
  )
}
