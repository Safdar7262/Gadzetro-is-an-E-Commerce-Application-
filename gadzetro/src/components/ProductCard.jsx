import { useState } from 'react'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'
import useCart from '../hooks/useCart.js'
import '../styles/ProductCard.css'

const PLACEHOLDER = '/images/placeholder.svg'
const formatPrice = (amount) => `₹${amount.toLocaleString('en-IN')}`

function Stars({ rating }) {
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => {
        if (rating >= n) return <FaStar key={n} />
        if (rating >= n - 0.5) return <FaStarHalfAlt key={n} />
        return <FaRegStar key={n} />
      })}
    </span>
  )
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  const handleAdd = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <article className="product-card">
      <span className="discount-badge">{discount}% OFF</span>
      <div className="product-image">
        <img src={product.image} alt={product.name} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER }} />
      </div>
      <h3 className="product-name">{product.name}</h3>
      <div className="product-rating">
        <Stars rating={product.rating} />
        <span>{product.rating}</span>
        <span className="reviews">({product.reviews.toLocaleString('en-IN')})</span>
      </div>
      <div className="product-price">
        <strong>{formatPrice(product.price)}</strong>
        <s>{formatPrice(product.originalPrice)}</s>
      </div>
      <button className={`add-btn ${added ? 'added' : ''}`} onClick={handleAdd}>
        {added ? 'Added to Cart ✓' : 'Add to Cart'}
      </button>
    </article>
  )
}
