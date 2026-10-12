import { useCallback, useEffect, useMemo, useState } from 'react'
import { CartContext } from './CartContext.jsx' // same context object the homepage components already read
import { products as catalog } from '../data/catalog/products.js'
import { findCoupon } from '../data/coupons.js'
import { MAX_QTY_PER_ITEM } from '../data/storeSettings.js'
import { calculateTotals } from '../utils/pricing.js'
import { loadFromStorage, saveToStorage } from '../utils/storage.js'

const byId = (id) => catalog.find((p) => p.id === id)
const limitFor = (product) => Math.max(0, Math.min(product.stock, MAX_QTY_PER_ITEM))
const sanitizeLines = (raw) =>
  (Array.isArray(raw) ? raw : []).filter((l) => l && Number.isInteger(l.id) && Number.isInteger(l.qty) && l.qty >= 1 && byId(l.id))

// Cart = [{ id, qty }] saved in localStorage; product details always come from the shared catalog.
// It keeps the old API (items, addToCart, cartCount) so the homepage keeps working, and adds the rest.
export function CartStoreProvider({ children }) {
  const [lines, setLines] = useState(() => sanitizeLines(loadFromStorage('cart', [])))
  const [savedIds, setSavedIds] = useState(() => (loadFromStorage('savedForLater', []) || []).filter((id) => byId(id)))
  const [couponCode, setCouponCode] = useState(() => loadFromStorage('coupon', ''))

  useEffect(() => { saveToStorage('cart', lines) }, [lines])
  useEffect(() => { saveToStorage('savedForLater', savedIds) }, [savedIds])
  useEffect(() => { saveToStorage('coupon', couponCode) }, [couponCode])

  const items = useMemo(
    () => lines.map((l) => { const p = byId(l.id); return { ...p, qty: Math.max(1, Math.min(l.qty, limitFor(p))) } }),
    [lines]
  )
  const savedItems = useMemo(() => savedIds.map(byId).filter(Boolean), [savedIds])
  const coupon = findCoupon(couponCode)
  const cartCount = items.reduce((total, item) => total + item.qty, 0)

  const addToCart = useCallback((product, qty = 1) => {
    const p = byId(product?.id)
    if (!p || p.stock <= 0) return
    const amount = Math.max(1, Math.floor(Number(qty)) || 1)
    setLines((prev) => {
      const existing = prev.find((l) => l.id === p.id)
      const nextQty = Math.min(limitFor(p), (existing ? existing.qty : 0) + amount)
      return existing ? prev.map((l) => (l.id === p.id ? { ...l, qty: nextQty } : l)) : [...prev, { id: p.id, qty: nextQty }]
    })
    setSavedIds((prev) => prev.filter((id) => id !== p.id))
  }, [])

  const increaseQty = useCallback((id) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, qty: Math.min(Math.max(limitFor(byId(id)), 1), l.qty + 1) } : l)))
  }, [])
  const decreaseQty = useCallback((id) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, qty: Math.max(1, l.qty - 1) } : l)))
  }, [])
  const removeFromCart = useCallback((id) => setLines((prev) => prev.filter((l) => l.id !== id)), [])
  const clearCart = useCallback(() => { setLines([]); setCouponCode('') }, [])

  const saveForLater = useCallback((id) => {
    setLines((prev) => prev.filter((l) => l.id !== id))
    setSavedIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])
  const removeSaved = useCallback((id) => setSavedIds((prev) => prev.filter((x) => x !== id)), [])

  // Returns { ok, message } so the UI can show feedback.
  const applyCoupon = useCallback((code) => {
    const found = findCoupon(code)
    if (!String(code || '').trim()) return { ok: false, message: 'Enter a coupon code.' }
    if (!found) return { ok: false, message: 'Invalid coupon code.' }
    const result = calculateTotals(items, found).coupon
    if (!result.valid) return { ok: false, message: result.reason }
    setCouponCode(found.code)
    return { ok: true, message: `${found.code} applied. ${found.description}.` }
  }, [items])
  const removeCoupon = useCallback(() => setCouponCode(''), [])
  const getTotals = useCallback((shippingMethodId = 'standard') => calculateTotals(items, coupon, shippingMethodId), [items, coupon])

  const value = useMemo(
    () => ({
      items, cartCount, addToCart, increaseQty, decreaseQty, removeFromCart, clearCart,
      savedItems, saveForLater, moveSavedToCart: addToCart, removeSaved,
      appliedCoupon: coupon, applyCoupon, removeCoupon, getTotals,
    }),
    [items, cartCount, addToCart, increaseQty, decreaseQty, removeFromCart, clearCart, savedItems, saveForLater, removeSaved, coupon, applyCoupon, removeCoupon, getTotals]
  )
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
