// MOCK address book (localStorage, one list per user id).
import { respond, fail } from './mockApi.js'
import { loadFromStorage, saveToStorage } from '../utils/storage.js'

const KEY = 'addresses'
const seed = {
  'u-customer': [{ id: 'a-home', label: 'Home', fullName: 'Demo Customer', phone: '9876543210', line1: '12 MG Road', line2: '', city: 'Bengaluru', state: 'Karnataka', pincode: '560001', isDefault: true }],
}
const listFor = (userId) => loadFromStorage(KEY, {})[userId] ?? seed[userId] ?? []
const save = (userId, list) => saveToStorage(KEY, { ...loadFromStorage(KEY, {}), [userId]: list })
const withSingleDefault = (list, defaultId) => list.map((a) => ({ ...a, isDefault: a.id === defaultId }))

export const getAddresses = (userId) => respond(listFor(userId))

export function addAddress(userId, data) {
  const list = listFor(userId)
  const address = { ...data, id: `a-${Date.now().toString(36)}` }
  const next = [...list, address]
  const defaultId = address.isDefault || list.length === 0 ? address.id : list.find((a) => a.isDefault)?.id
  save(userId, withSingleDefault(next, defaultId))
  return respond(listFor(userId))
}

export function updateAddress(userId, addressId, data) {
  const list = listFor(userId)
  if (!list.some((a) => a.id === addressId)) return fail('Address not found.', 404)
  const next = list.map((a) => (a.id === addressId ? { ...a, ...data, id: addressId } : a))
  const defaultId = data.isDefault ? addressId : next.find((a) => a.isDefault && a.id !== addressId)?.id ?? (list.find((a) => a.isDefault)?.id === addressId ? addressId : next[0].id)
  save(userId, withSingleDefault(next, defaultId))
  return respond(listFor(userId))
}

export function deleteAddress(userId, addressId) {
  const list = listFor(userId)
  const next = list.filter((a) => a.id !== addressId)
  const hadDefault = list.find((a) => a.id === addressId)?.isDefault
  save(userId, next.length ? withSingleDefault(next, hadDefault ? next[0].id : next.find((a) => a.isDefault)?.id) : [])
  return respond(listFor(userId))
}

export function setDefaultAddress(userId, addressId) {
  const list = listFor(userId)
  if (!list.some((a) => a.id === addressId)) return fail('Address not found.', 404)
  save(userId, withSingleDefault(list, addressId))
  return respond(listFor(userId))
}
