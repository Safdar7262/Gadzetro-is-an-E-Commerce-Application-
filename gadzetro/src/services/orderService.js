// MOCK implementation: orders are saved in localStorage. The backend will replace these with apiClient calls.
import { respond, fail } from './mockApi.js'
import { products } from '../data/catalog/products.js'
import { findCoupon } from '../data/coupons.js'
import { MAX_QTY_PER_ITEM } from '../data/storeSettings.js'
import { calculateTotals } from '../utils/pricing.js'
import { loadFromStorage, saveToStorage } from '../utils/storage.js'
import { mockOrders } from '../data/mockOrders.js'

const KEY = 'orders'
const readStored = () => loadFromStorage(KEY, [])
// Demo orders are included unless a saved copy (e.g. cancelled) already replaces them.
const readOrders = () => {
  const stored = readStored()
  return [...stored, ...mockOrders.filter((m) => !stored.some((s) => s.id === m.id))]
}
const newestFirst = (list) => [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
const upsert = (order) => {
  const stored = readStored()
  saveToStorage(KEY, stored.some((o) => o.id === order.id) ? stored.map((o) => (o.id === order.id ? order : o)) : [...stored, order])
}

export const CANCELLABLE_STATUSES = ['Placed', 'Processing']
export const canCancel = (order) => CANCELLABLE_STATUSES.includes(order.status)
export const belongsToUser = (order, user) =>
  !!user && (order.userId === user.id || order.customer?.email?.toLowerCase() === user.email.toLowerCase())

export const getOrders = () => respond(newestFirst(readOrders()))
export const getOrdersForUser = (user) => respond(newestFirst(readOrders().filter((o) => belongsToUser(o, user))))

export function updateOrderStatus(orderId, status) {
  const order = readOrders().find((o) => o.id === orderId)
  if (!order) return fail('Order not found', 404)
  const updated = { ...order, status, statusHistory: [...order.statusHistory, { status, at: new Date().toISOString() }] }
  upsert(updated)
  return respond(updated)
}

export function cancelOrder(orderId) {
  const order = readOrders().find((o) => o.id === orderId)
  if (!order) return fail('Order not found', 404)
  if (!canCancel(order)) return fail('This order can no longer be cancelled.', 409)
  return updateOrderStatus(orderId, 'Cancelled')
}

export const getOrderById = (orderId) => {
  const order = readOrders().find((o) => o.id === orderId)
  return order ? respond(order) : fail('Order not found', 404)
}

// Prices are looked up from the catalog and totals recalculated here (never trusted from the page),
// just like a real backend would do.
export function createOrder({ userId = null, items, couponCode, shippingMethod, paymentMethod, customer, shippingAddress, billingAddress }) {
  if (!Array.isArray(items) || items.length === 0) return fail('Your cart is empty.', 400)

  const lines = []
  for (const { productId, qty } of items) {
    const product = products.find((p) => p.id === productId && p.status === 'active')
    if (!product) return fail('One of the products is no longer available.', 404)
    if (qty < 1 || qty > Math.min(product.stock, MAX_QTY_PER_ITEM)) {
      return fail(`${product.name} is out of stock or the quantity is too high.`, 409)
    }
    lines.push({ productId: product.id, slug: product.slug, name: product.name, image: product.images[0], price: product.price, qty })
  }

  const coupon = couponCode ? findCoupon(couponCode) : null
  const totals = calculateTotals(lines, coupon, shippingMethod)
  if (couponCode && !totals.coupon.valid) return fail(totals.coupon.reason || 'Coupon is not valid.', 400)

  const createdAt = new Date().toISOString()
  const order = {
    id: `GZ${Date.now().toString(36).toUpperCase()}`,
    userId,
    createdAt,
    status: 'Placed',
    statusHistory: [{ status: 'Placed', at: createdAt }],
    items: lines,
    pricing: { subtotal: totals.subtotal, discount: totals.discount, shipping: totals.shipping, tax: totals.tax, total: totals.total },
    couponCode: coupon ? coupon.code : null,
    shippingMethod,
    paymentMethod,
    customer,
    shippingAddress,
    billingAddress,
  }
  upsert(order)
  return respond(order, 600)
}
