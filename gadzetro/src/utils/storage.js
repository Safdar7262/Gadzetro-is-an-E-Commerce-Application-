// Safe localStorage helpers (never throw, even in private mode). Keys are prefixed with "gadzetro:".
const PREFIX = 'gadzetro:'

export function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeFromStorage(key) {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch {
    /* ignore */
  }
}
