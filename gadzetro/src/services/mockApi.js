// Helpers that make mock services behave like async API calls (so pages already handle loading + errors).
const DEFAULT_DELAY = 300

export const respond = (data, delay = DEFAULT_DELAY) =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), delay))

export const fail = (message, status = 400, delay = DEFAULT_DELAY) =>
  new Promise((_, reject) => setTimeout(() => reject({ status, message }), delay))
