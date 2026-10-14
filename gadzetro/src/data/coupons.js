// DEMO coupons. The defaults below can be edited in Admin > Coupons (saved in localStorage).
// type: percent | flat | freeShipping   active: false hides the coupon from customers
import { loadFromStorage, saveToStorage } from '../utils/storage.js'

export const defaultCoupons = [
  { code: 'WELCOME10', type: 'percent', value: 10, maxDiscount: 500, minSubtotal: 1000, description: '10% off (max ₹500) on orders of ₹1,000 or more', active: true },
  { code: 'FLAT200', type: 'flat', value: 200, minSubtotal: 1500, description: '₹200 off on orders of ₹1,500 or more', active: true },
  { code: 'FREESHIP', type: 'freeShipping', value: 0, minSubtotal: 0, description: 'Free shipping on any order', active: true },
  { code: 'BIGSAVE', type: 'percent', value: 15, maxDiscount: 3000, minSubtotal: 20000, description: '15% off (max ₹3,000) on orders of ₹20,000 or more', active: true },
]

export const getCoupons = () => loadFromStorage('coupons', defaultCoupons)
export const saveCoupons = (list) => saveToStorage('coupons', list)

// Only active coupons can be used by customers.
export const findCoupon = (code) => {
  const wanted = String(code || '').trim().toUpperCase()
  return getCoupons().find((c) => c.active !== false && c.code === wanted) || null
}