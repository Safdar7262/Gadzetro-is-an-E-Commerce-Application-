// MOCK reviews written by customers (localStorage). One review per user per product.
import { respond, fail } from './mockApi.js'
import { loadFromStorage, saveToStorage } from '../utils/storage.js'

const KEY = 'reviews'
const readAll = () => loadFromStorage(KEY, [])

export const getReviews = () => respond(readAll())
export const getReviewsByUser = (userId) => respond(readAll().filter((r) => r.userId === userId))
export const getReviewsByProduct = (productId) => respond(readAll().filter((r) => r.productId === productId))

export function saveReview({ userId, userName, productId, rating, title, text }) {
  const all = readAll()
  const now = new Date().toISOString()
  const existing = all.find((r) => r.userId === userId && r.productId === productId)
  const review = existing
    ? { ...existing, rating, title, text, updatedAt: now }
    : { id: `rv-${Date.now().toString(36)}`, userId, userName, productId, rating, title, text, createdAt: now }
  saveToStorage(KEY, existing ? all.map((r) => (r.id === existing.id ? review : r)) : [...all, review])
  return respond(review)
}

export function deleteReview(userId, reviewId) {
  const all = readAll()
  if (!all.some((r) => r.id === reviewId && r.userId === userId)) return fail('Review not found.', 404)
  saveToStorage(KEY, all.filter((r) => r.id !== reviewId))
  return respond({ deleted: true })
}
