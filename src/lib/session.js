const SESSION_KEY = 'ssr-auth-session'

export function getSession() {
  if (typeof window === 'undefined') return null

  try {
    return JSON.parse(window.localStorage.getItem(SESSION_KEY) || 'null')
  } catch {
    return null
  }
}

export function setSession(session) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(SESSION_KEY)
}
