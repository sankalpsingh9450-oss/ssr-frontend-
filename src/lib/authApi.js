import { API_URL } from '../constants'
import { getRuntimeEnv } from './runtimeEnv'

const apiBase = API_URL
const defaultGoogleAuthUrl = apiBase?.replace(/\/api\/v1$/, '/auth/google')

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
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
  const isLocalFallback = !apiBase || apiBase.includes('localhost:8000/api/v1')

  if (isLocalFallback) {
    await wait(900)
    return mockResponse
  }

  const response = await fetch(`${apiBase}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (response.status === 429) {
    throw new Error('Too many attempts. Please wait a moment before trying again.')
  }

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  return response.json()
}

export const authApi = {
  async login(payload) {
    return request('/auth/login', payload, {
      success: true,
      user: { name: 'SSR Client', email: payload.email },
      message: 'Signed in successfully.',
    })
  },

  async register(payload) {
    return request('/auth/register', payload, {
      success: true,
      user: { name: payload.fullName, email: payload.email },
      message: 'Account created successfully.',
    })
  },

  async sendOtp(payload) {
    return request('/auth/forgot-password/send-otp', payload, {
      success: true,
      email: payload.email,
      message: 'OTP sent to your email address.',
    })
  },

  async resendOtp(payload) {
    return request('/auth/forgot-password/resend-otp', payload, {
      success: true,
      email: payload.email,
      message: 'A fresh OTP has been sent.',
    })
  },

  async resetPassword(payload) {
    return request('/auth/forgot-password/reset', payload, {
      success: true,
      message: 'Password reset successfully.',
    })
  },

  getGoogleAuthUrl() {
    return getRuntimeEnv('VITE_AUTH_GOOGLE_URL', defaultGoogleAuthUrl || '')
  },
}
