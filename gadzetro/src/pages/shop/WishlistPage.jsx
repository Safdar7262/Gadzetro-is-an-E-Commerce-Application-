import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart } from 'react-icons/fi'
import Rating from '../../components/common/Rating.jsx'
import Button from '../../components/common/Button.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import Loader from '../../components/common/Loader.jsx'
import useCart from '../../hooks/useCart.js'
import useWishlist from '../../hooks/useWishlist.js'
import useCatalog from '../../hooks/useCatalog.js'
import { calcDiscountPercent, formatCurrency } from '../../utils/currency.js'
import '../../styles/ProductCard.css'
import '../../styles/products.css'

export default function WishlistPage() {
  const { wishlistIds, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { products, loading, error } = useCatalog()
  const [addedId, setAddedId] = useState(null)

  const items = wishlistIds.map((id) => products.find((p) => p.id === id)).filter(Boolean)

  const handleAdd = (product) => {
    addToCart(product)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  return (
    <div className="container page">
      <h1 className="page-title">My wishlist{items.length > 0 ? ` (${items.length})` : ''}</h1>
      {loading ? <Loader label="Loading wishlist..." /> : error ? (
        <EmptyState title="Could not load wishlist" message={error} />
      ) : items.length === 0 ? (
        <EmptyState icon={<FiHeart />} title="Your wishlist is empty" message="Tap the heart on any product to save it here."
          action={<Button to="/shop">Browse products</Button>} />
      ) : (
        <div className="listing-grid">
          {items.map((p) => {
            const discount = calcDiscountPercent(p.price, p.originalPrice)
            const out = p.stock <= 0
            return (
              <article key={p.id} className="product-card">
                {discount > 0 && <span className="discount-badge">{discount}% OFF</span>}
                <Link to={`/product/${p.slug}`} className="product-image">
                  <img src={p.images[0]} alt={p.name} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/placeholder.svg' }} />
                  {out && <span className="stock-badge">Out of stock</span>}
                </Link>
                <h3 className="product-name"><Link to={`/product/${p.slug}`}>{p.name}</Link></h3>
                <Rating value={p.rating} count={p.reviewCount} />
                <div className="product-price"><strong>{formatCurrency(p.price)}</strong><s>{formatCurrency(p.originalPrice)}</s></div>
                <div className="wish-actions">
                  <button type="button" className={`add-btn ${addedId === p.id ? 'added' : ''}`} disabled={out} onClick={() => handleAdd(p)}>
                    {addedId === p.id ? 'Added ✓' : 'Add to Cart'}
                  </button>
                  <Button size="sm" variant="outline" disabled={out} onClick={() => { addToCart(p); removeFromWishlist(p.id) }}>Move to cart</Button>
                  <Button size="sm" variant="ghost" onClick={() => removeFromWishlist(p.id)}>Remove</Button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
