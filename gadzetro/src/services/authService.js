// MOCK auth. Users and sessions live in localStorage/sessionStorage. This is NOT secure authentication:
// the Spring Boot backend (Spring Security + JWT) will replace every function here.
import { respond, fail } from './mockApi.js'
import { mockUsers } from '../data/mockUsers.js'
import { hashPassword } from '../utils/hash.js'

const USERS_KEY = 'gadzetro:users'
const SESSION_KEY = 'gadzetro:session'

const read = (storage, key) => { try { return JSON.parse(storage.getItem(key)) } catch { return null } }
const write = (storage, key, value) => { try { storage.setItem(key, JSON.stringify(value)) } catch { /* ignore */ } }

function readUsers() {
  const stored = read(localStorage, USERS_KEY)
  if (Array.isArray(stored)) return stored
  write(localStorage, USERS_KEY, mockUsers)
  return mockUsers
}
const saveUsers = (users) => write(localStorage, USERS_KEY, users)
export const toPublicUser = ({ passwordHash, ...user }) => user // never expose the hash to the UI

export const getStoredUsers = () => readUsers().map(toPublicUser)

export async function loginUser({ email, password }) {
  const user = readUsers().find((u) => u.email.toLowerCase() === String(email).trim().toLowerCase())
  if (!user || user.passwordHash !== hashPassword(user.id, password)) return fail('Invalid email or password.', 401)
  return respond({ user: toPublicUser(user), token: null }) // token stays null: no real JWT in the mock phase
}

export async function registerUser({ name, email, phone, password }) {
  const users = readUsers()
  if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) return fail('An account with this email already exists.', 409)
  const id = `u-${Date.now().toString(36)}`
  const user = {
    id, name: name.trim(), email: email.trim(), phone: phone.trim(),
    role: 'customer', createdAt: new Date().toISOString(), passwordHash: hashPassword(id, password),
  }
  saveUsers([...users, user])
  return respond(toPublicUser(user))
}

export async function updateProfile(userId, { name, email, phone }) {
  const users = readUsers()
  const current = users.find((u) => u.id === userId)
  if (!current) return fail('User not found.', 404)
  const emailTaken = users.some((u) => u.id !== userId && u.email.toLowerCase() === email.trim().toLowerCase())
  if (emailTaken) return fail('Another account already uses this email.', 409)
  const updated = { ...current, name: name.trim(), phone: phone.trim(), email: email.trim() }
  saveUsers(users.map((u) => (u.id === userId ? updated : u)))
  return respond(toPublicUser(updated))
}

// Simulated only: nothing is emailed and no token is generated.
export const requestPasswordReset = () => respond({ simulated: true })
export const resetPassword = () => respond({ simulated: true })

// ----- session helpers (the AuthContext uses these) -----
// export function readSession() {
//   const saved = read(localStorage, SESSION_KEY) || read(sessionStorage, SESSION_KEY)
//   if (!saved?.id) return null
//   const fresh = readUsers().find((u) => u.id === saved.id) // always use the latest stored profile
//   return fresh ? toPublicUser(fresh) : null
// }
// export function persistSession(user, remember) {
//   const [keep, other] = remember ? [localStorage, sessionStorage] : [sessionStorage, localStorage]
//   write(keep, SESSION_KEY, { id: user.id })
//   try { other.removeItem(SESSION_KEY) } catch { /* ignore */ }
// }
// export function clearSession() {
//   try { localStorage.removeItem(SESSION_KEY); sessionStorage.removeItem(SESSION_KEY) } catch { /* ignore */ }
// }


export function readSession() {
  const inThisTab = read(sessionStorage, SESSION_KEY)
  const remembered = read(localStorage, SESSION_KEY)
  const saved = inThisTab?.id ? inThisTab : remembered
  if (!saved?.id) return null
  const fresh = readUsers().find((u) => u.id === saved.id) // always use the latest stored profile
  if (!fresh) return null
  // An admin must log in again in every new browser tab, so an old "remembered" admin session is ignored.
  if (fresh.role === 'admin' && saved === remembered) {
    try { localStorage.removeItem(SESSION_KEY) } catch { /* ignore */ }
    return null
  }
  return toPublicUser(fresh)
}
export function persistSession(user, remember) {
  // Admin sessions are never "remembered": they end when the browser tab is closed.
  const keepForever = remember && user.role !== 'admin'
  const [keep, other] = keepForever ? [localStorage, sessionStorage] : [sessionStorage, localStorage]
  write(keep, SESSION_KEY, { id: user.id })
  try { other.removeItem(SESSION_KEY) } catch { /* ignore */ }
}