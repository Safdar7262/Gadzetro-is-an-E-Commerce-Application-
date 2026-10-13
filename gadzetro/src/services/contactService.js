// MOCK: messages are only saved in localStorage; nothing is emailed. The backend will replace this.
import { respond } from './mockApi.js'
import { loadFromStorage, saveToStorage } from '../utils/storage.js'

const KEY = 'contactMessages'

export function submitContactMessage({ name, email, subject, message }) {
  const entry = {
    id: `MSG-${Date.now().toString(36).toUpperCase()}`,
    name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim(),
    createdAt: new Date().toISOString(),
  }
  saveToStorage(KEY, [...loadFromStorage(KEY, []), entry])
  return respond({ id: entry.id, simulated: true }, 500)
}