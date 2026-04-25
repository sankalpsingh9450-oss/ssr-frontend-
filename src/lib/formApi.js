import { API_URL } from '../constants'

const NEWSLETTER_STORE_KEY = 'ssr-newsletter-signups'

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isLocalFallback() {
  return !API_URL || API_URL.includes('localhost:8000/api/v1')
}

async function parseError(response) {
  try {
    const data = await response.json()
    return data?.message || data?.detail || 'Something went wrong. Please try again.'
  } catch {
    return 'Something went wrong. Please try again.'
  }
}

async function request(endpoint, payload, mockResponse) {
  if (isLocalFallback()) {
    await wait(900)
    return mockResponse
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (response.status === 429) {
    throw new Error('Too many attempts. Please wait a moment and try again.')
  }

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  return response.json()
}

function getNewsletterEntries() {
  if (typeof window === 'undefined') return []

  try {
    return JSON.parse(window.localStorage.getItem(NEWSLETTER_STORE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveNewsletterEntry(entry) {
  if (typeof window === 'undefined') return
  const current = getNewsletterEntries()
  window.localStorage.setItem(NEWSLETTER_STORE_KEY, JSON.stringify([...current, entry]))
}

export const formApi = {
  async submitLead(payload) {
    return request('/lead', payload, {
      success: true,
      message: 'Lead received successfully',
    })
  },

  async submitQuoteRequest(payload) {
    return request('/quote/', payload, {
      success: true,
      message: 'Quote request submitted successfully. A confirmation email has been queued.',
    })
  },

  async submitContactInquiry(payload) {
    return request('/contact/', payload, {
      success: true,
      message: 'Your message has been sent successfully.',
    })
  },

  async submitNewsletterSignup(payload) {
    const normalizedEmail = payload.email.trim().toLowerCase()
    const existing = getNewsletterEntries()
    if (existing.some((entry) => entry.email === normalizedEmail)) {
      throw new Error('This email is already subscribed to updates.')
    }

    const response = await request('/newsletter/', payload, {
      success: true,
      message: 'You are subscribed successfully. Please check your email for confirmation.',
    })

    saveNewsletterEntry({
      email: normalizedEmail,
      name: payload.name || '',
      preferences: payload.preferences || [],
      createdAt: new Date().toISOString(),
    })

    return response
  },

  async submitBusinessInquiry(payload) {
    return request('/partners/', payload, {
      success: true,
      message: 'Your business enquiry has been received successfully.',
    })
  },

  async submitPropertyLead(payload) {
    return this.submitLead(payload)
  },
}
