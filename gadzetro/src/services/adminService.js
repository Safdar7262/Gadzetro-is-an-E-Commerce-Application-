// MOCK admin API. Changes are saved in localStorage and update the same shared data the shop uses.
// The Spring Boot backend (with real role checks) will replace these functions.
import { respond, fail } from './mockApi.js'
import { products } from '../data/catalog/products.js'
import { categories } from '../data/catalog/categories.js'
import { brands } from '../data/catalog/brands.js'
import { getCoupons, saveCoupons } from '../data/coupons.js'
import { storeSettings } from '../data/storeSettings.js'
import { getOrders, getOrderById, updateOrderStatus, belongsToUser, NEXT_STATUSES } from './orderService.js'
import { getStoredUsers, setUserBlocked, deleteUser } from './authService.js'
import { getReviews, setReviewStatus, deleteReviewAsAdmin } from './reviewService.js'
import { saveToStorage, removeFromStorage } from '../utils/storage.js'

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const uniqueSlug = (base, ignoreId) => {
  let slug = base || 'item'
  let n = 2
  while (products.some((p) => p.slug === slug && p.id !== ignoreId)) { slug = `${base}-${n}`; n += 1 }
  return slug
}
const saveProducts = () => saveToStorage('catalog:products', products)
const saveCategories = () => saveToStorage('catalog:categories', categories)
const saveBrands = () => saveToStorage('catalog:brands', brands)

// ---------- products ----------
export const getAdminProducts = () => respond([...products])

export function getAdminProductById(id) {
  const product = products.find((p) => p.id === Number(id))
  return product ? respond(product) : fail('Product not found.', 404)
}

const toLines = (text) => String(text || '').split('\n').map((l) => l.trim()).filter(Boolean)
const toSpecs = (text) =>
  Object.fromEntries(toLines(text).map((l) => { const i = l.indexOf(':'); return i > 0 ? [l.slice(0, i).trim(), l.slice(i + 1).trim()] : null }).filter((e) => e && e[1]))

// The form edits price (MRP) and discount %; the selling price is calculated from them.
function fieldsFromForm(v) {
  const mrp = Number(v.mrp)
  return {
    name: v.name.trim(), sku: v.sku.trim(), description: v.description.trim(),
    categoryId: v.categoryId, category: v.categoryId, brandId: v.brandId,
    originalPrice: mrp, price: Math.round((mrp * (100 - Number(v.discount))) / 100),
    stock: Number(v.stock), status: v.status,
    highlights: toLines(v.highlights), specifications: toSpecs(v.specs),
    isFeatured: !!v.isFeatured, isBestSeller: !!v.isBestSeller, isNewArrival: !!v.isNewArrival,
  }
}
const skuTaken = (sku, ignoreId) => products.some((p) => p.id !== ignoreId && String(p.sku).toLowerCase() === sku.trim().toLowerCase())

export function createProduct(values) {
  if (skuTaken(values.sku)) return fail('Another product already uses this SKU.', 409)
  const id = Math.max(0, ...products.map((p) => p.id)) + 1
  const fields = fieldsFromForm(values)
  const product = {
    id, slug: uniqueSlug(slugify(fields.name)), ...fields,
    image: values.image, images: [values.image], rating: 0, reviewCount: 0,
    createdAt: new Date().toISOString().slice(0, 10),
  }
  products.push(product)
  saveProducts()
  return respond(product)
}

export function updateProduct(id, values) {
  const index = products.findIndex((p) => p.id === Number(id))
  if (index === -1) return fail('Product not found.', 404)
  if (skuTaken(values.sku, Number(id))) return fail('Another product already uses this SKU.', 409)
  const current = products[index]
  const fields = fieldsFromForm(values)
  const images = values.image === current.images[0] ? current.images : [values.image]
  const slug = fields.name === current.name ? current.slug : uniqueSlug(slugify(fields.name), current.id)
  products[index] = { ...current, ...fields, slug, image: images[0], images }
  saveProducts()
  return respond(products[index])
}

export function deleteProduct(id) {
  const index = products.findIndex((p) => p.id === Number(id))
  if (index === -1) return fail('Product not found.', 404)
  products.splice(index, 1)
  saveProducts()
  return respond({ deleted: true })
}

// ---------- categories ----------
export const getAdminCategories = () => respond([...categories])

export function createCategory({ name, description, image, banner }) {
  const id = slugify(name)
  if (!id) return fail('Enter a valid name.', 400)
  if (categories.some((c) => c.id === id)) return fail('A category with this name already exists.', 409)
  const category = { id, slug: id, name: name.trim(), description: description.trim(), image: image?.trim() || '', banner: banner?.trim() || null }
  categories.push(category)
  saveCategories()
  return respond(category)
}

export function updateCategory(id, { name, description, image, banner }) {
  const index = categories.findIndex((c) => c.id === id)
  if (index === -1) return fail('Category not found.', 404)
  categories[index] = { ...categories[index], name: name.trim(), description: description.trim(), image: image?.trim() || '', banner: banner?.trim() || null }
  saveCategories()
  return respond(categories[index])
}

export function deleteCategory(id) {
  const index = categories.findIndex((c) => c.id === id)
  if (index === -1) return fail('Category not found.', 404)
  const used = products.filter((p) => p.categoryId === id).length
  if (used > 0) return fail(`${used} product${used > 1 ? 's' : ''} still use this category. Move or delete them first.`, 409)
  categories.splice(index, 1)
  saveCategories()
  return respond({ deleted: true })
}

// ---------- brands ----------
export const getAdminBrands = () => respond([...brands])

export function createBrand({ name, description, color }) {
  const id = slugify(name)
  if (!id) return fail('Enter a valid name.', 400)
  if (brands.some((b) => b.id === id)) return fail('A brand with this name already exists.', 409)
  const brand = { id, slug: id, name: name.trim(), description: description.trim(), color, banner: null }
  brands.push(brand)
  saveBrands()
  return respond(brand)
}

export function updateBrand(id, { name, description, color }) {
  const index = brands.findIndex((b) => b.id === id)
  if (index === -1) return fail('Brand not found.', 404)
  brands[index] = { ...brands[index], name: name.trim(), description: description.trim(), color }
  saveBrands()
  return respond(brands[index])
}

export function deleteBrand(id) {
  const index = brands.findIndex((b) => b.id === id)
  if (index === -1) return fail('Brand not found.', 404)
  const used = products.filter((p) => p.brandId === id).length
  if (used > 0) return fail(`${used} product${used > 1 ? 's' : ''} still use this brand. Move or delete them first.`, 409)
  brands.splice(index, 1)
  saveBrands()
  return respond({ deleted: true })
}

// ---------- coupons ----------
export const getAdminCoupons = () => respond(getCoupons())

const couponFromForm = (v) => ({
  code: v.code.trim().toUpperCase(), type: v.type,
  value: v.type === 'freeShipping' ? 0 : Number(v.value),
  ...(v.type === 'percent' && Number(v.maxDiscount) > 0 ? { maxDiscount: Number(v.maxDiscount) } : {}),
  minSubtotal: Number(v.minSubtotal), description: v.description.trim(), active: !!v.active,
})

export function createCoupon(values) {
  const list = getCoupons()
  const coupon = couponFromForm(values)
  if (list.some((c) => c.code === coupon.code)) return fail('This coupon code already exists.', 409)
  saveCoupons([...list, coupon])
  return respond(coupon)
}

export function updateCoupon(code, values) {
  const list = getCoupons()
  if (!list.some((c) => c.code === code)) return fail('Coupon not found.', 404)
  const coupon = couponFromForm(values)
  if (coupon.code !== code && list.some((c) => c.code === coupon.code)) return fail('This coupon code already exists.', 409)
  saveCoupons(list.map((c) => (c.code === code ? coupon : c)))
  return respond(coupon)
}

export function deleteCoupon(code) {
  const list = getCoupons()
  if (!list.some((c) => c.code === code)) return fail('Coupon not found.', 404)
  saveCoupons(list.filter((c) => c.code !== code))
  return respond({ deleted: true })
}

// ---------- dashboard (all numbers are calculated from demo data) ----------
export const ORDER_STATUSES = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

export async function getAdminStats() {
  const orders = await getOrders() // newest first
  const counted = orders.filter((o) => o.status !== 'Cancelled') // cancelled orders earn nothing
  const bestMap = new Map()
  counted.forEach((o) => o.items.forEach((i) => {
    const row = bestMap.get(i.productId) || { productId: i.productId, name: i.name, image: i.image, slug: i.slug, qty: 0, revenue: 0 }
    row.qty += i.qty
    row.revenue += i.qty * i.price
    bestMap.set(i.productId, row)
  }))

  const now = new Date()
  const monthlyRevenue = Array.from({ length: 6 }, (_, k) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - k), 1)
    const value = counted
      .filter((o) => { const c = new Date(o.createdAt); return c.getFullYear() === d.getFullYear() && c.getMonth() === d.getMonth() })
      .reduce((sum, o) => sum + o.pricing.total, 0)
    return { label: d.toLocaleString('en-IN', { month: 'short' }), value }
  })

  return respond({
    totalProducts: products.length,
    lowStock: products.filter((p) => p.stock > 0 && p.stock <= 10).length,
    outOfStock: products.filter((p) => p.stock === 0).length,
    totalOrders: orders.length,
    totalCustomers: getStoredUsers().filter((u) => u.role === 'customer').length,
    totalRevenue: counted.reduce((sum, o) => sum + o.pricing.total, 0),
    statusCounts: Object.fromEntries(ORDER_STATUSES.map((s) => [s, orders.filter((o) => o.status === s).length])),
    recentOrders: orders.slice(0, 5),
    bestSelling: [...bestMap.values()].sort((a, b) => b.qty - a.qty).slice(0, 5),
    monthlyRevenue,
  })
}

// ---------- orders ----------
export const getAdminOrders = () => getOrders()
export const getAdminOrderById = (id) => getOrderById(id)

export function changeOrderStatus(orderId, status) {
  return getOrderById(orderId).then((order) => {
    if (!(NEXT_STATUSES[order.status] || []).includes(status)) return fail(`An order that is ${order.status} cannot be changed to ${status}.`, 409)
    return updateOrderStatus(orderId, status)
  })
}

// ---------- customers ----------
export async function getAdminCustomers() {
  const orders = await getOrders()
  const customers = getStoredUsers().filter((u) => u.role === 'customer').map((u) => {
    const mine = orders.filter((o) => belongsToUser(o, u))
    return {
      ...u, blocked: !!u.blocked, orderCount: mine.length,
      totalSpent: mine.filter((o) => o.status !== 'Cancelled').reduce((sum, o) => sum + o.pricing.total, 0),
      recentOrders: mine.slice(0, 5).map((o) => ({ id: o.id, total: o.pricing.total, status: o.status, createdAt: o.createdAt })),
    }
  })
  return respond(customers)
}
export const setCustomerBlocked = (userId, blocked) => setUserBlocked(userId, blocked)
export const deleteCustomer = (userId) => deleteUser(userId)

// ---------- reviews ----------
export async function getAdminReviews() {
  const list = await getReviews()
  return respond(
    list.map((r) => ({ ...r, status: r.status || 'published', productName: products.find((p) => p.id === r.productId)?.name ?? `Product #${r.productId}` }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  )
}
export const setAdminReviewStatus = (id, status) => setReviewStatus(id, status)
export const deleteAdminReview = (id) => deleteReviewAsAdmin(id)

// ---------- settings ----------
export const getAdminSettings = () => respond({ ...storeSettings })

export function saveAdminSettings(v) {
  const next = {
    storeName: v.storeName.trim(), logo: v.logo.trim() || storeSettings.logo, contactEmail: v.contactEmail.trim(),
    shippingCharge: Number(v.shippingCharge), expressShippingCharge: Number(v.expressShippingCharge),
    freeShippingThreshold: Number(v.freeShippingThreshold), taxRate: Math.round(Number(v.taxPercent) * 100) / 10000,
  }
  Object.assign(storeSettings, next) // pricing, cart and checkout read these values, so they update straight away
  saveToStorage('settings', { ...storeSettings })
  return respond({ ...storeSettings })
}

// Removes admin edits (products, categories, brands, coupons, settings). The page must be reloaded afterwards.
export function resetDemoData() {
  ;['catalog:products', 'catalog:categories', 'catalog:brands', 'coupons', 'settings'].forEach(removeFromStorage)
  return respond({ reset: true })
}