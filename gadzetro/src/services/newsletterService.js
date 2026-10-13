// MOCK: subscribers are only saved in localStorage; no email service is connected.
import { respond } from './mockApi.js'
import { loadFromStorage, saveToStorage } from '../utils/storage.js'

const KEY = 'newsletterSubscribers'

export function subscribeToNewsletter(email) {
  const clean = email.trim().toLowerCase()
  const subscribers = loadFromStorage(KEY, [])
  if (subscribers.some((s) => s.email === clean)) return respond({ alreadySubscribed: true })
  saveToStorage(KEY, [...subscribers, { email: clean, subscribedAt: new Date().toISOString() }])
  return respond({ alreadySubscribed: false })
}