import { jest } from '@jest/globals'

jest.mock('../../src/constants', () => ({
  API_URL: 'http://localhost:8000/api/v1',
}))

describe('formApi', () => {
  beforeEach(() => {
    jest.resetModules()
    window.localStorage.clear()
  })

  test('prevents duplicate newsletter signups', async () => {
    const { formApi } = await import('../../src/lib/formApi')

    await formApi.submitNewsletterSignup({ email: 'hello@example.com', name: 'SSR', preferences: [] })

    await expect(
      formApi.submitNewsletterSignup({ email: 'hello@example.com', name: 'SSR', preferences: [] })
    ).rejects.toThrow('already subscribed')
  })

  test('returns fallback success for quote submissions in local mode', async () => {
    const { formApi } = await import('../../src/lib/formApi')
    const response = await formApi.submitQuoteRequest({ name: 'SSR' })
    expect(response.success).toBe(true)
  })
})
