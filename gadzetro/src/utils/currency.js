export const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`

export const calcDiscountPercent = (price, originalPrice) =>
  originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0
