// DEMO orders for the demo customer so the account pages have content. Built from the shared catalog.
import { products } from './catalog/products.js'
import { defaultCoupons } from './coupons.js'
import { calculateTotals } from '../utils/pricing.js'

export const ORDER_STEPS = ['Placed', 'Processing', 'Shipped', 'Delivered']
const ADDRESS = { fullName: 'Demo Customer', phone: '9876543210', line1: '12 MG Road', line2: '', city: 'Bengaluru', state: 'Karnataka', pincode: '560001' }

function makeOrder({ id, placedAt, status, lines, paymentMethod, couponCode = null }) {
  const items = lines.map(([productId, qty]) => {
    const p = products.find((x) => x.id === productId)
    return { productId, slug: p.slug, name: p.name, image: p.images[0], price: p.price, qty }
  })
  const totals = calculateTotals(items, couponCode ? defaultCoupons.find((c) => c.code === couponCode) : null, 'standard')
  const start = new Date(placedAt).getTime()
  return {
    id, userId: 'u-customer', createdAt: new Date(start).toISOString(), status,
    statusHistory: ORDER_STEPS.slice(0, ORDER_STEPS.indexOf(status) + 1).map((s, i) => ({ status: s, at: new Date(start + i * 1.2 * 86400000).toISOString() })),
    items,
    pricing: { subtotal: totals.subtotal, discount: totals.discount, shipping: totals.shipping, tax: totals.tax, total: totals.total },
    couponCode, shippingMethod: 'standard', paymentMethod,
    customer: { name: 'Demo Customer', email: 'customer@gadzetro.demo', phone: '9876543210' },
    shippingAddress: ADDRESS, billingAddress: ADDRESS,
  }
}

export const mockOrders = [
  makeOrder({ id: 'GZDEMO1001', placedAt: '2026-09-02T10:15:00Z', status: 'Delivered', lines: [[1, 1], [5, 2]], paymentMethod: 'upi' }),
  makeOrder({ id: 'GZDEMO1002', placedAt: '2026-10-05T14:40:00Z', status: 'Shipped', lines: [[3, 1], [17, 1]], paymentMethod: 'cod', couponCode: 'WELCOME10' }),
  makeOrder({ id: 'GZDEMO1003', placedAt: '2026-10-10T18:05:00Z', status: 'Processing', lines: [[11, 1]], paymentMethod: 'card' }),
]
