import { API_URL, SITE } from '../constants'

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isLocalFallback() {
  return !API_URL || API_URL.includes('localhost:8000/api/v1')
}

async function safePost(endpoint, payload, fallback) {
  if (isLocalFallback()) {
    await wait(500)
    return fallback
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Chat service is temporarily unavailable.')
  }

  return response.json()
}

export async function createChatLead(payload) {
  return safePost('/chatbot/lead', payload, {
    success: true,
    message: `Lead captured for ${payload.name}.`,
  })
}

export async function sendTranscriptEmail(payload) {
  return safePost('/chatbot/transcript', payload, {
    success: true,
    message: `Transcript sent to ${payload.email}.`,
  })
}

export function trackChatEvent(eventName, payload = {}) {
  if (typeof window === 'undefined') return

  if (window.gtag) {
    window.gtag('event', eventName, payload)
  }

  if (window.fbq) {
    window.fbq('trackCustom', eventName, payload)
  }

  window.dispatchEvent(
    new CustomEvent('ssr-chatbot-analytics', {
      detail: {
        eventName,
        payload,
        timestamp: Date.now(),
        company: SITE.name,
      },
    })
  )
}
