import { clearSession, getSession, setSession } from '../../src/lib/session'

describe('session helpers', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  test('stores and retrieves session data', () => {
    setSession({ email: 'user@example.com', name: 'SSR Client' })
    expect(getSession()).toEqual({ email: 'user@example.com', name: 'SSR Client' })
  })

  test('clears session data', () => {
    setSession({ email: 'user@example.com' })
    clearSession()
    expect(getSession()).toBeNull()
  })
})
