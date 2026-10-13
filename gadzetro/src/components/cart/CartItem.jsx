import { Link } from 'react-router-dom'
import { FiTrash2, FiBookmark, FiHeart } from 'react-icons/fi'
import { formatCurrency } from '../../utils/currency.js'
import { MAX_QTY_PER_ITEM } from '../../data/storeSettings.js'

const PLACEHOLDER = '/images/placeholder.svg'

export default function CartItem({ item, wished, onIncrease, onDecrease, onRemove, onSave, onMoveToWishlist }) {
  const unavailable = item.stock <= 0
  const maxQty = Math.min(item.stock, MAX_QTY_PER_ITEM)
  const link = `/product/${item.slug}`
  return (
    <article className="cart-item">
      <Link to={link} className="cart-item-image">
        <img src={item.images[0]} alt={item.name} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER }} />
      </Link>
      <div className="cart-item-body">
        <h3><Link to={link}>{item.name}</Link></h3>
        <p className="cart-item-price">{formatCurrency(item.price)} <s>{formatCurrency(item.originalPrice)}</s></p>
        {unavailable && <p className="cart-warning" role="alert">This item is out of stock. Remove it to continue.</p>}
        {!unavailable && item.qty >= maxQty && <p className="muted small">Maximum {maxQty} per order</p>}
        <div className="cart-item-actions">
          <button type="button" onClick={onRemove}><FiTrash2 /> Remove</button>
          <button type="button" onClick={onSave}><FiBookmark /> Save for later</button>
          <button type="button" onClick={onMoveToWishlist}><FiHeart /> {wished ? 'Remove (already in wishlist)' : 'Move to wishlist'}</button>
        </div>
      </div>
      <div className="cart-item-side">
        <div className="qty" role="group" aria-label={`Quantity for ${item.name}`}>
          <button type="button" onClick={onDecrease} aria-label={item.qty <= 1 ? 'Remove item' : 'Decrease quantity'}>−</button>
          <span aria-live="polite">{item.qty}</span>
          <button type="button" onClick={onIncrease} disabled={unavailable || item.qty >= maxQty} aria-label="Increase quantity">+</button>
        </div>
        <strong>{formatCurrency(item.price * item.qty)}</strong>
      </div>
    </article>
  )
}
