import { storeSettings } from '../data/storeSettings.js'
import { formatCurrency } from './currency.js'

export const SHIPPING_METHODS = [
  { id: 'standard', label: 'Standard delivery', days: '3-5 business days' },
  { id: 'express', label: 'Express delivery', days: '1-2 business days' },
]

// Checks a coupon against the current subtotal. All amounts are whole rupees.
export function evaluateCoupon(coupon, subtotal) {
  const none = { valid: false, discount: 0, freeShipping: false, reason: '' }
  if (!coupon) return none
  if (subtotal < coupon.minSubtotal) {
    return { ...none, reason: `Add items worth ${formatCurrency(coupon.minSubtotal - subtotal)} more to use ${coupon.code}.` }
  }
  let discount = 0
  if (coupon.type === 'percent') discount = Math.min(Math.round((subtotal * coupon.value) / 100), coupon.maxDiscount ?? Infinity)
  if (coupon.type === 'flat') discount = coupon.value
  return { valid: true, discount: Math.min(discount, subtotal), freeShipping: coupon.type === 'freeShipping', reason: '' }
}

export function calculateTotals(items, coupon = null, shippingMethodId = 'standard') {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const itemCount = items.reduce((sum, i) => sum + i.qty, 0)
  const couponResult = evaluateCoupon(coupon, subtotal)
  const discount = couponResult.discount
  const taxable = subtotal - discount

  let shipping = 0
  if (items.length > 0 && !couponResult.freeShipping) {
    if (shippingMethodId === 'express') shipping = storeSettings.expressShippingCharge
    else shipping = subtotal >= storeSettings.freeShippingThreshold ? 0 : storeSettings.shippingCharge
  }
  const tax = Math.round(taxable * storeSettings.taxRate)
  const freeShippingGap = items.length > 0 ? Math.max(0, storeSettings.freeShippingThreshold - subtotal) : 0

  return { itemCount, subtotal, discount, shipping, tax, total: taxable + shipping + tax, coupon: couponResult, freeShippingGap }
}
