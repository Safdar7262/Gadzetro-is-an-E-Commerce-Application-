// DEMO coupons with simple rules. type: percent | flat | freeShipping
export const coupons = [
  { code: 'WELCOME10', type: 'percent', value: 10, maxDiscount: 500, minSubtotal: 1000, description: '10% off (max ₹500) on orders of ₹1,000 or more' },
  { code: 'FLAT200', type: 'flat', value: 200, minSubtotal: 1500, description: '₹200 off on orders of ₹1,500 or more' },
  { code: 'FREESHIP', type: 'freeShipping', value: 0, minSubtotal: 0, description: 'Free shipping on any order' },
  { code: 'BIGSAVE', type: 'percent', value: 15, maxDiscount: 3000, minSubtotal: 20000, description: '15% off (max ₹3,000) on orders of ₹20,000 or more' },
]

export const findCoupon = (code) => coupons.find((c) => c.code === String(code || '').trim().toUpperCase()) || null
