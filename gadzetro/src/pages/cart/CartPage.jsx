import { useNavigate } from 'react-router-dom'
import { FiShoppingCart } from 'react-icons/fi'
import CartItem from '../../components/cart/CartItem.jsx'
import CartSummary from '../../components/cart/CartSummary.jsx'
import CouponBox from '../../components/cart/CouponBox.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import Button from '../../components/common/Button.jsx'
import useCart from '../../hooks/useCart.js'
import useWishlist from '../../hooks/useWishlist.js'
import { formatCurrency } from '../../utils/currency.js'
import '../../styles/cart.css'

export default function CartPage() {
  const navigate = useNavigate()
  const cart = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { items, savedItems } = cart
  const totals = cart.getTotals('standard')
  const hasUnavailable = items.some((i) => i.stock <= 0)

  const moveToWishlist = (item) => {
    if (!isInWishlist(item.id)) toggleWishlist(item.id)
    cart.removeFromCart(item.id)
  }

  const savedSection = savedItems.length > 0 && (
    <section className="saved">
      <h2>Saved for later ({savedItems.length})</h2>
      {savedItems.map((p) => (
        <article key={p.id} className="saved-item">
          <img src={p.images[0]} alt={p.name} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/placeholder.svg' }} />
          <div><strong>{p.name}</strong><p>{formatCurrency(p.price)}</p></div>
          <Button size="sm" onClick={() => cart.moveSavedToCart(p)} disabled={p.stock <= 0}>{p.stock <= 0 ? 'Out of stock' : 'Move to cart'}</Button>
          <Button size="sm" variant="ghost" onClick={() => cart.removeSaved(p.id)}>Remove</Button>
        </article>
      ))}
    </section>
  )

  if (items.length === 0) {
    return (
      <div className="container page">
        <h1 className="page-title">Shopping cart</h1>
        <EmptyState icon={<FiShoppingCart />} title="Your cart is empty" message="Looks like you have not added anything yet."
          action={<Button to="/shop">Continue shopping</Button>} />
        {savedSection}
      </div>
    )
  }

  return (
    <div className="container page">
      <h1 className="page-title">Shopping cart ({cart.cartCount})</h1>
      <div className="cart-layout">
        <div>
          {items.map((item) => (
            <CartItem key={item.id} item={item} wished={isInWishlist(item.id)}
              onIncrease={() => cart.increaseQty(item.id)} onDecrease={() => cart.decreaseQty(item.id)}
              onRemove={() => cart.removeFromCart(item.id)} onSave={() => cart.saveForLater(item.id)} onMoveToWishlist={() => moveToWishlist(item)} />
          ))}
          <Button to="/shop" variant="ghost">← Continue shopping</Button>
                    
          {savedSection}
        </div>
        <aside>
          <CartSummary totals={totals} couponCode={cart.appliedCoupon?.code}>
            <CouponBox appliedCoupon={cart.appliedCoupon} couponState={totals.coupon} onApply={cart.applyCoupon} onRemove={cart.removeCoupon} />
            {hasUnavailable && <p className="cart-warning" role="alert">Remove out-of-stock items to continue.</p>}
            <Button size="lg" className="full" disabled={hasUnavailable} onClick={() => navigate('/checkout')}>Proceed to checkout</Button>
          </CartSummary>
        </aside>
      </div>
    </div>
  )
}
