const PREFIX = 'cjp:'

export function load(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function save(key, value) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // ignore quota errors
  }
}

export function remove(key) {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(PREFIX + key)
}
