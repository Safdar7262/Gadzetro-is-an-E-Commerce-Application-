// MOCK implementation. When the backend is ready, replace each function body with an apiClient call
// (e.g. apiClient.get('/products')) - the function names and return shapes stay the same.
import { respond, fail } from './mockApi.js'
import { products } from '../data/catalog/products.js'
import { categories } from '../data/catalog/categories.js'
import { brands } from '../data/catalog/brands.js'
import { sampleReviews } from '../data/catalog/reviews.js'

const activeProducts = () => products.filter((p) => p.status === 'active')

export const getProducts = () => respond(activeProducts())

export const getProductById = (id) => {
  const product = activeProducts().find((p) => p.id === Number(id))
  return product ? respond(product) : fail('Product not found', 404)
}

export const getProductBySlug = (slug) => {
  const product = activeProducts().find((p) => p.slug === slug)
  return product ? respond(product) : fail('Product not found', 404)
}

// Searches name, description, category and brand. Every word typed must match somewhere.
export const searchProducts = (query) => {
  const words = String(query || '').toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length === 0) return respond(activeProducts())
  const matches = activeProducts().filter((p) => {
    const category = categories.find((c) => c.id === p.categoryId)?.name ?? ''
    const brand = brands.find((b) => b.id === p.brandId)?.name ?? ''
    const haystack = `${p.name} ${p.description} ${category} ${brand}`.toLowerCase()
    return words.every((word) => haystack.includes(word))
  })
  return respond(matches)
}

export const getCategories = () => respond(categories)
export const getBrands = () => respond(brands)

export const getCategoryBySlug = (slug) => {
  const category = categories.find((c) => c.slug === slug)
  return category ? respond(category) : fail('Category not found', 404)
}

export const getBrandBySlug = (slug) => {
  const brand = brands.find((b) => b.slug === slug)
  return brand ? respond(brand) : fail('Brand not found', 404)
}

// Sample reviews rotate by product id so different products show different reviews.
export const getProductReviews = (productId) => {
  const start = Number(productId) % sampleReviews.length
  const list = [...sampleReviews.slice(start), ...sampleReviews.slice(0, start)].slice(0, 4)
  return respond(list)
}
