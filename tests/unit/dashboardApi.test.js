import { jest } from '@jest/globals'

jest.mock('../../src/constants', () => ({
  SITE: {
    founder: 'SSR Founder',
    email: 'hello@ssrgroupcivil.in',
    phone: '+919876543210',
    logo: '/logo.png',
  },
}))

describe('dashboardApi', () => {
  beforeEach(() => {
    jest.resetModules()
    window.localStorage.clear()
  })

  test('updates profile data persistently', async () => {
    const { dashboardApi } = await import('../../src/lib/dashboardApi')

    const updated = await dashboardApi.updateProfile({
      displayName: 'SSR Client',
      phone: '+919876543210',
    })

    expect(updated.displayName).toBe('SSR Client')

    const profile = await dashboardApi.getProfile()
    expect(profile.displayName).toBe('SSR Client')
    expect(profile.phone).toBe('+919876543210')
  })

  test('filters and paginates inquiries', async () => {
    const { dashboardApi } = await import('../../src/lib/dashboardApi')

    const result = await dashboardApi.getInquiries({
      filter: 'Pending',
      page: 1,
      pageSize: 2,
    })

    expect(result.items.every((item) => item.status === 'Pending')).toBe(true)
    expect(result.page).toBe(1)
    expect(result.totalPages).toBeGreaterThanOrEqual(1)
  })

  test('increments revision count when quote modification is requested', async () => {
    const { dashboardApi } = await import('../../src/lib/dashboardApi')

    const before = await dashboardApi.getQuotes()
    const initialRevisionCount = before[0].revisionCount

    const updated = await dashboardApi.requestQuoteModification(before[0].id)
    const quote = updated.find((item) => item.id === before[0].id)

    expect(quote.status).toBe('Pending')
    expect(quote.revisionCount).toBe(initialRevisionCount + 1)
  })
})
