const STORAGE_KEY = 'ssr-saved-property-ids'

function normalizeIds(value) {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => Number(item))
    .filter((item, index, array) => Number.isFinite(item) && array.indexOf(item) === index)
}

export function getSavedPropertyIds() {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return normalizeIds(JSON.parse(raw))
  } catch {
    return []
  }
}

export function setSavedPropertyIds(ids) {
  if (typeof window === 'undefined') return []

  const next = normalizeIds(ids)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export function toggleSavedPropertyId(id) {
  const current = getSavedPropertyIds()
  const next = current.includes(id)
    ? current.filter((item) => item !== id)
    : [...current, id]

  return setSavedPropertyIds(next)
}
