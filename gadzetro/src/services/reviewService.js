// MOCK reviews (localStorage). One review per user per product. status: 'published' | 'hidden' (admin moderation).
// A few demo reviews are added the first time, so the admin reviews page has something to show.
import { respond, fail } from './mockApi.js'
import { loadFromStorage, saveToStorage } from '../utils/storage.js'

const KEY = 'reviews'
const seedReviews = [
  { id: 'rv-seed-1', userId: 'u-seed-1', userName: 'Aarav S.', productId: 1, rating: 5, title: 'Great sound for the price', text: 'Battery lasts all day and pairing is quick. Happy with this purchase.', createdAt: '2026-09-10T10:00:00.000Z', status: 'published' },
  { id: 'rv-seed-2', userId: 'u-seed-2', userName: 'Priya M.', productId: 3, rating: 4, title: 'Loud and portable', text: 'Good bass for the size. Wish the strap was a bit longer.', createdAt: '2026-09-18T14:30:00.000Z', status: 'published' },
  { id: 'rv-seed-3', userId: 'u-seed-3', userName: 'Rahul K.', productId: 11, rating: 2, title: 'Delivery was late', text: 'The phone is fine but it arrived three days after the estimate.', createdAt: '2026-10-02T09:15:00.000Z', status: 'published' },
  { id: 'rv-seed-4', userId: 'u-seed-4', userName: 'Imran A.', productId: 2, rating: 5, title: 'Looks premium', text: 'Display is bright and the calling feature works well.', createdAt: '2026-10-06T18:45:00.000Z', status: 'published' },
]

const readAll = () => {
  const stored = loadFromStorage(KEY, null)
  if (stored === null) { saveToStorage(KEY, seedReviews); return seedReviews }
  return stored
}

export const getReviews = () => respond(readAll())
export const getReviewsByUser = (userId) => respond(readAll().filter((r) => r.userId === userId))
export const getReviewsByProduct = (productId) => respond(readAll().filter((r) => r.productId === productId && r.status !== 'hidden'))

export function saveReview({ userId, userName, productId, rating, title, text }) {
  const all = readAll()
  const now = new Date().toISOString()
  const existing = all.find((r) => r.userId === userId && r.productId === productId)
  const review = existing
    ? { ...existing, rating, title, text, updatedAt: now }
    : { id: `rv-${Date.now().toString(36)}`, userId, userName, productId, rating, title, text, createdAt: now, status: 'published' }
  saveToStorage(KEY, existing ? all.map((r) => (r.id === existing.id ? review : r)) : [...all, review])
  return respond(review)
}

export function deleteReview(userId, reviewId) {
  const all = readAll()
  if (!all.some((r) => r.id === reviewId && r.userId === userId)) return fail('Review not found.', 404)
  saveToStorage(KEY, all.filter((r) => r.id !== reviewId))
  return respond({ deleted: true })
}

// ----- admin moderation -----
export function setReviewStatus(reviewId, status) {
  const all = readAll()
  if (!all.some((r) => r.id === reviewId)) return fail('Review not found.', 404)
  if (!['published', 'hidden'].includes(status)) return fail('Invalid status.', 400)
  saveToStorage(KEY, all.map((r) => (r.id === reviewId ? { ...r, status } : r)))
  return respond({ id: reviewId, status })
}

export function deleteReviewAsAdmin(reviewId) {
  const all = readAll()
  if (!all.some((r) => r.id === reviewId)) return fail('Review not found.', 404)
  saveToStorage(KEY, all.filter((r) => r.id !== reviewId))
  return respond({ deleted: true })
}