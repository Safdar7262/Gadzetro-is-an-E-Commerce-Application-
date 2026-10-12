import { calcDiscountPercent } from './currency.js'
import { formatCurrency } from './currency.js'

export const PAGE_SIZE = 9
export const SORT_OPTIONS = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
]

const toList = (value) => (value ? value.split(',').filter(Boolean) : [])
const toNumberString = (value) => (value !== null && value !== '' && Number.isFinite(Number(value)) && Number(value) >= 0 ? String(Number(value)) : '')

export function parseFilters(params) {
  const sort = params.get('sort')
  return {
    categories: toList(params.get('category')),
    brands: toList(params.get('brand')),
    min: toNumberString(params.get('min')),
    max: toNumberString(params.get('max')),
    rating: Number(params.get('rating')) || 0,
    discount: Number(params.get('discount')) || 0,
    inStock: params.get('stock') === '1',
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? sort : 'popularity',
    page: Math.max(1, Math.floor(Number(params.get('page'))) || 1),
  }
}

// Only non-default values are written, so URLs stay short.
export function toParams(filters, q = '') {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (filters.categories.length) params.set('category', filters.categories.join(','))
  if (filters.brands.length) params.set('brand', filters.brands.join(','))
  if (filters.min !== '') params.set('min', filters.min)
  if (filters.max !== '') params.set('max', filters.max)
  if (filters.rating > 0) params.set('rating', String(filters.rating))
  if (filters.discount > 0) params.set('discount', String(filters.discount))
  if (filters.inStock) params.set('stock', '1')
  if (filters.sort !== 'popularity') params.set('sort', filters.sort)
  if (filters.page > 1) params.set('page', String(filters.page))
  return params
}

export function applyFilters(products, f) {
  const min = f.min === '' ? null : Number(f.min)
  const max = f.max === '' ? null : Number(f.max)
  return products.filter(
    (p) =>
      (f.categories.length === 0 || f.categories.includes(p.categoryId)) &&
      (f.brands.length === 0 || f.brands.includes(p.brandId)) &&
      (min === null || p.price >= min) &&
      (max === null || p.price <= max) &&
      p.rating >= f.rating &&
      (!f.inStock || p.stock > 0) &&
      calcDiscountPercent(p.price, p.originalPrice) >= f.discount
  )
}

export function sortProducts(products, sort) {
  const list = [...products]
  if (sort === 'price-asc') return list.sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') return list.sort((a, b) => b.price - a.price)
  if (sort === 'newest') return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return list.sort((a, b) => b.reviewCount - a.reviewCount) // popularity
}

export function getActiveFilters(f, { categories = [], brands = [] }) {
  const chips = []
  f.categories.forEach((id) => chips.push({ key: 'categories', value: id, label: categories.find((c) => c.id === id)?.name ?? id }))
  f.brands.forEach((id) => chips.push({ key: 'brands', value: id, label: brands.find((b) => b.id === id)?.name ?? id }))
  if (f.min !== '' || f.max !== '') {
    const from = f.min !== '' ? formatCurrency(f.min) : '₹0'
    const to = f.max !== '' ? formatCurrency(f.max) : 'any'
    chips.push({ key: 'price', value: 'price', label: `Price: ${from} to ${to}` })
  }
  if (f.rating > 0) chips.push({ key: 'rating', value: f.rating, label: `${f.rating}★ & up` })
  if (f.discount > 0) chips.push({ key: 'discount', value: f.discount, label: `${f.discount}%+ off` })
  if (f.inStock) chips.push({ key: 'inStock', value: true, label: 'In stock only' })
  return chips
}
