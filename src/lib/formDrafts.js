const PREFIX = 'ssr-form-draft'

export function loadDraft(key, fallback) {
  if (typeof window === 'undefined') return fallback

  try {
    const raw = window.localStorage.getItem(`${PREFIX}:${key}`)
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback
  } catch {
    return fallback
  }
}

export function saveDraft(key, value) {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(`${PREFIX}:${key}`, JSON.stringify(value))
  } catch {
    // Ignore draft persistence failures.
  }
}

export function clearDraft(key) {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.removeItem(`${PREFIX}:${key}`)
  } catch {
    // Ignore draft persistence failures.
  }
}
