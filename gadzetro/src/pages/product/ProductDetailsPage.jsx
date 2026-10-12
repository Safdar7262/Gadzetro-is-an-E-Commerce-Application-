import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FiHeart, FiShoppingCart, FiZap, FiTruck } from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'
import ProductGallery from '../../components/products/ProductGallery.jsx'
import ProductGrid from '../../components/products/ProductGrid.jsx'
import Rating from '../../components/common/Rating.jsx'
import Button from '../../components/common/Button.jsx'
import Loader from '../../components/common/Loader.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import useCart from '../../hooks/useCart.js'
import useWishlist from '../../hooks/useWishlist.js'
import useCatalog from '../../hooks/useCatalog.js'
import useRecentlyViewed from '../../hooks/useRecentlyViewed.js'
import { getProductBySlug, getProductReviews } from '../../services/productService.js'
import { calcDiscountPercent, formatCurrency } from '../../utils/currency.js'
import { formatDate } from '../../utils/formatDate.js'
import '../../styles/products.css'

const MAX_QTY = 10

// Simulated delivery check (demo only): PINs starting with 9 are "not serviceable".
function checkPin(pin) {
  if (!/^[1-9][0-9]{5}$/.test(pin)) return { ok: false, message: 'Enter a valid 6-digit PIN code.' }
  if (pin.startsWith('9')) return { ok: false, message: 'Sorry, delivery is not available for this PIN code (demo).' }
  const days = 2 + (Number(pin[0]) % 4)
  return { ok: true, message: `Delivery in ${days}-${days + 2} days to ${pin} (demo estimate).` }
}

export default function ProductDetailsPage() {
  const { productSlug } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const catalog = useCatalog()
  const { recentIds, addRecentlyViewed } = useRecentlyViewed()

  const [state, setState] = useState({ product: null, loading: true, error: '' })
  const [reviews, setReviews] = useState([])
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [pin, setPin] = useState('')
  const [pinResult, setPinResult] = useState(null)

  useEffect(() => {
    let cancelled = false
    setState({ product: null, loading: true, error: '' })
    setQty(1); setPin(''); setPinResult(null)
    getProductBySlug(productSlug)
      .then((product) => {
        if (cancelled) return
        setState({ product, loading: false, error: '' })
        addRecentlyViewed(product.id)
        getProductReviews(product.id).then((list) => { if (!cancelled) setReviews(list) })
      })
      .catch((err) => { if (!cancelled) setState({ product: null, loading: false, error: err.message || 'Could not load product' }) })
    return () => { cancelled = true }
  }, [productSlug, addRecentlyViewed])

  const { product, loading, error } = state
  if (loading) return <div className="container page"><Loader label="Loading product..." /></div>
  if (!product) {
    return (
      <div className="container page">
        <EmptyState title="Product not found" message={error || 'This product is unavailable.'} action={<Button to="/shop">Back to shop</Button>} />
      </div>
    )
  }

  const brand = catalog.brands.find((b) => b.id === product.brandId)
  const category = catalog.categories.find((c) => c.id === product.categoryId)
  const discount = calcDiscountPercent(product.price, product.originalPrice)
  const outOfStock = product.stock <= 0
  const maxQty = Math.min(product.stock, MAX_QTY)
  const wished = isInWishlist(product.id)
  const stockClass = outOfStock ? 'out' : product.stock <= 10 ? 'low' : 'in'
  const stockText = outOfStock ? 'Out of stock' : product.stock <= 10 ? `Only ${product.stock} left in stock` : 'In stock'

  const sameCategory = catalog.products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
  const others = catalog.products.filter((p) => p.categoryId !== product.categoryId && p.id !== product.id)
  const related = [...sameCategory, ...others].slice(0, 4)
  const recent = recentIds.filter((id) => id !== product.id).map((id) => catalog.products.find((p) => p.id === id)).filter(Boolean).slice(0, 4)

  const addQtyToCart = () => addToCart(product, qty)
  const handleAdd = () => { addQtyToCart(); setAdded(true); setTimeout(() => setAdded(false), 1500) }
  const handleBuyNow = () => { addQtyToCart(); navigate('/checkout') }
  const handlePin = (e) => { e.preventDefault(); setPinResult(checkPin(pin.trim())) }

  return (
    <div className="container page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <Link to="/shop">Shop</Link>
        {category && <> / <Link to={`/category/${category.slug}`}>{category.name}</Link></>} / <span>{product.name}</span>
      </nav>

      <div className="pd">
        <ProductGallery key={product.id} images={product.images} name={product.name} />

        <div className="pd-info">
          {brand && <Link to={`/brand/${brand.slug}`} className="pd-brand">{brand.name}</Link>}
          <h1>{product.name}</h1>
          <Rating value={product.rating} count={product.reviewCount} />
          <div className="pd-price">
            <strong>{formatCurrency(product.price)}</strong>
            <s>{formatCurrency(product.originalPrice)}</s>
            {discount > 0 && <span className="pd-discount">{discount}% off</span>}
          </div>
          <p className={`stock ${stockClass}`}>{stockText}</p>
          <p>{product.description}</p>

          {!outOfStock && (
            <div className="pd-actions">
              <div className="qty" role="group" aria-label="Quantity">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Decrease quantity">−</button>
                <span aria-live="polite">{qty}</span>
                <button type="button" onClick={() => setQty((q) => Math.min(maxQty, q + 1))} disabled={qty >= maxQty} aria-label="Increase quantity">+</button>
              </div>
            </div>
          )}
          <div className="pd-actions">
            <Button onClick={handleAdd} disabled={outOfStock}><FiShoppingCart /> {added ? 'Added to Cart ✓' : 'Add to Cart'}</Button>
            <Button variant="outline" onClick={handleBuyNow} disabled={outOfStock}><FiZap /> Buy Now</Button>
            <Button variant="ghost" onClick={() => toggleWishlist(product.id)} aria-pressed={wished}>
              {wished ? <FaHeart color="#e5383b" /> : <FiHeart />} {wished ? 'In Wishlist' : 'Add to Wishlist'}
            </Button>
          </div>

          <div className="pin-box">
            <strong><FiTruck /> Check delivery</strong>
            <form className="pin-form" onSubmit={handlePin}>
              <input type="text" inputMode="numeric" maxLength={6} placeholder="Enter PIN code" aria-label="Delivery PIN code" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} />
              <Button type="submit" variant="outline" size="sm">Check</Button>
            </form>
            {pinResult && <p className={`pin-msg ${pinResult.ok ? 'ok' : 'bad'}`} role="status">{pinResult.message}</p>}
          </div>
        </div>
      </div>

      <section className="pd-section">
        <h2>Highlights</h2>
        <ul className="highlights">{product.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
      </section>

      <section className="pd-section">
        <h2>Specifications</h2>
        <table className="specs">
          <tbody>{Object.entries(product.specifications).map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}</tbody>
        </table>
      </section>

      <section className="pd-section">
        <h2>Customer reviews</h2>
        <div className="review-summary"><strong>{product.rating}</strong><Rating value={product.rating} count={product.reviewCount} showValue={false} /></div>
        <p className="muted">Showing sample reviews for demonstration.</p>
        {reviews.map((r) => (
          <article key={r.id} className="review">
            <Rating value={r.rating} showValue={false} />
            <h3>{r.title}</h3>
            <p>{r.text}</p>
            <small className="muted">{r.name} · {formatDate(r.date)}</small>
          </article>
        ))}
      </section>

      {related.length > 0 && (
        <section className="pd-section"><h2>Related products</h2><ProductGrid products={related} /></section>
      )}
      {recent.length > 0 && (
        <section className="pd-section"><h2>Recently viewed</h2><ProductGrid products={recent} /></section>
      )}
    </div>
  )
}
