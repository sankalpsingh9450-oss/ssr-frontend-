import { jest } from '@jest/globals'

jest.mock('../../src/constants', () => ({
  CONTACT_SUBJECTS: ['Construction Quote'],
  SERVICES: [
    { title: 'Residential Construction' },
    { title: 'Commercial Projects' },
    { title: 'Interior Design' },
  ],
  PROJECTS: [
    { title: 'Skyline Residency', type: 'Residential' },
    { title: 'Corporate One', type: 'Commercial' },
  ],
  SITE: {
    phone: '+919876543210',
    email: 'hello@ssrgroupcivil.in',
    address: 'Greater Noida West',
    hours: 'Mon-Sat, 9 AM - 7 PM',
  },
  WHATSAPP_URL: 'https://wa.me/919876543210',
}))

describe('chatbotEngine', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  test('detects Hindi language cues', async () => {
    const { detectLanguage } = await import('../../src/lib/chatbotEngine')
    expect(detectLanguage('नमस्ते')).toBe('hi')
  })

  test('detects frustrated sentiment', async () => {
    const { detectSentiment } = await import('../../src/lib/chatbotEngine')
    expect(detectSentiment('This is not working, worst experience')).toBe('frustrated')
  })

  test('returns known response for pricing question', async () => {
    const { getBotReply } = await import('../../src/lib/chatbotEngine')
    const response = getBotReply("What's your pricing?")
    expect(response.text).toMatch(/pricing depends on scope/i)
  })

  test('builds lead capture prompts step by step', async () => {
    const { buildLeadCapturePrompt, nextLeadField } = await import('../../src/lib/chatbotEngine')
    expect(buildLeadCapturePrompt({})).toMatch(/may i have your name/i)
    expect(nextLeadField({ name: 'SSR' })).toBe('email')
  })

  test('returns handoff links and quick replies', async () => {
    const { getQuickReplies, humanHandoffLinks } = await import('../../src/lib/chatbotEngine')
    expect(getQuickReplies('handoff')).toContain('Talk to agent')
    expect(humanHandoffLinks().whatsapp).toMatch(/^https:\/\/wa\.me\//)
  })
})
