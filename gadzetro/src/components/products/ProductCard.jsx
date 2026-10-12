import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart } from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'
import useCart from '../../hooks/useCart.js'
import useWishlist from '../../hooks/useWishlist.js'
import Rating from '../common/Rating.jsx'
import { calcDiscountPercent, formatCurrency } from '../../utils/currency.js'
import '../../styles/ProductCard.css' // reuse homepage card look
import '../../styles/products.css'

const PLACEHOLDER = '/images/placeholder.svg'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [added, setAdded] = useState(false)
  const discount = calcDiscountPercent(product.price, product.originalPrice)
  const outOfStock = product.stock <= 0
  const wished = isInWishlist(product.id)
  const link = `/product/${product.slug}`

  const handleAdd = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <article className="product-card">
      {discount > 0 && <span className="discount-badge">{discount}% OFF</span>}
      <button type="button" className={`wish-btn ${wished ? 'active' : ''}`} onClick={() => toggleWishlist(product.id)} aria-pressed={wished} aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}>
        {wished ? <FaHeart /> : <FiHeart />}
      </button>
      <Link to={link} className="product-image">
        <img src={product.images[0]} alt={product.name} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER }} />
        {outOfStock && <span className="stock-badge">Out of stock</span>}
      </Link>
      <h3 className="product-name"><Link to={link}>{product.name}</Link></h3>
      <Rating value={product.rating} count={product.reviewCount} />
      <div className="product-price">
        <strong>{formatCurrency(product.price)}</strong>
        <s>{formatCurrency(product.originalPrice)}</s>
      </div>
      <button type="button" className={`add-btn ${added ? 'added' : ''}`} disabled={outOfStock} onClick={handleAdd}>
        {outOfStock ? 'Out of Stock' : added ? 'Added to Cart ✓' : 'Add to Cart'}
      </button>
    </article>
  )
}
