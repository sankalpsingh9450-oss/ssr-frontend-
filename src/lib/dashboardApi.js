import { API_URL, SITE } from '../constants'

const STORAGE_KEY = 'ssr-dashboard-data'
const delay = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms))

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

const defaultData = {
  profile: {
    displayName: SITE.founder,
    email: SITE.email,
    phone: SITE.phone,
    userSince: '2024-01-18',
    avatar: SITE.logo,
  },
  savedProjects: [
    {
      id: 'sv-1',
      name: 'Luxury Villa — Sector 1',
      location: 'Greater Noida West',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80',
      type: 'Residential Villa',
      budget: '₹1.2 Cr',
    },
    {
      id: 'sv-2',
      name: 'Corporate Office Complex',
      location: 'Noida Extension',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80',
      type: 'Commercial Office',
      budget: '₹3.8 Cr',
    },
    {
      id: 'sv-3',
      name: 'Independent Floor G+2',
      location: 'Sector 1, Greater Noida',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80',
      type: 'Residential Build',
      budget: '₹74 Lakh',
    },
  ],
  inquiries: [
    { id: 'inq-1', date: '2026-04-12', serviceType: 'Construction Quote', status: 'Pending', detail: 'G+2 floor construction for 1800 sq ft plot.' },
    { id: 'inq-2', date: '2026-04-09', serviceType: 'Property Search', status: 'Contacted', detail: 'Need 3BHK premium apartment in Greater Noida West.' },
    { id: 'inq-3', date: '2026-04-05', serviceType: 'Materials Supply', status: 'Completed', detail: 'Bulk requirement for TMT bars and cement supply.' },
    { id: 'inq-4', date: '2026-03-31', serviceType: 'Free BOQ Request', status: 'Pending', detail: 'Residential BOQ estimation for 1200 sq ft build.' },
    { id: 'inq-5', date: '2026-03-26', serviceType: 'Interior Finishing', status: 'Contacted', detail: 'Need modular kitchen and false ceiling package.' },
    { id: 'inq-6', date: '2026-03-18', serviceType: 'Partnership', status: 'Completed', detail: 'Supplier onboarding enquiry for plumbing products.' },
  ],
  quotes: [
    { id: 'qt-1', date: '2026-04-14', service: 'Residential Construction', amount: '₹32,40,000', status: 'Sent', pdfUrl: '#', revisionCount: 0 },
    { id: 'qt-2', date: '2026-04-07', service: 'BOQ Estimation', amount: '₹0', status: 'Reviewed', pdfUrl: '#', revisionCount: 1 },
    { id: 'qt-3', date: '2026-03-30', service: 'Material Procurement', amount: '₹8,95,000', status: 'Pending', pdfUrl: '#', revisionCount: 0 },
  ],
  settings: {
    notifications: {
      emailQuotes: true,
      emailProjectUpdates: true,
      smsAlerts: false,
      smsMarketing: false,
    },
    privacy: {
      shareProfileWithConsultant: true,
      allowSavedDataExports: true,
    },
    linkedAccounts: {
      google: true,
    },
  },
}

function hasWindow() {
  return typeof window !== 'undefined'
}

function readStore() {
  if (!hasWindow()) return structuredClone(defaultData)

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData))
    return structuredClone(defaultData)
  }

  try {
    const parsed = JSON.parse(raw)
    return {
      ...structuredClone(defaultData),
      ...parsed,
      settings: {
        ...structuredClone(defaultData).settings,
        ...parsed.settings,
        notifications: {
          ...structuredClone(defaultData).settings.notifications,
          ...parsed.settings?.notifications,
        },
        privacy: {
          ...structuredClone(defaultData).settings.privacy,
          ...parsed.settings?.privacy,
        },
        linkedAccounts: {
          ...structuredClone(defaultData).settings.linkedAccounts,
          ...parsed.settings?.linkedAccounts,
        },
      },
    }
  } catch {
    return structuredClone(defaultData)
  }
}

function writeStore(nextData) {
  if (hasWindow()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData))
  }
  return nextData
}

function updateStore(updater) {
  const current = readStore()
  const next = updater(current)
  return writeStore(next)
}

export const dashboardKeys = {
  all: ['dashboard'],
  profile: ['dashboard', 'profile'],
  savedProjects: ['dashboard', 'saved-projects'],
  inquiries: (filter = 'All', page = 1) => ['dashboard', 'inquiries', filter, page],
  quotes: ['dashboard', 'quotes'],
  settings: ['dashboard', 'settings'],
}

export const dashboardApi = {
  async getProfile() {
    await delay()
    return readStore().profile
  },

  async updateProfile(values) {
    await delay()
    const next = updateStore((data) => ({
      ...data,
      profile: { ...data.profile, ...values },
    }))
    return next.profile
  },

  async uploadAvatar(fileDataUrl) {
    await delay()
    const next = updateStore((data) => ({
      ...data,
      profile: { ...data.profile, avatar: fileDataUrl },
    }))
    return next.profile
  },

  async getSavedProjects() {
    await delay()
    return readStore().savedProjects
  },

  async removeSavedProject(id) {
    await delay()
    const next = updateStore((data) => ({
      ...data,
      savedProjects: data.savedProjects.filter((project) => project.id !== id),
    }))
    return next.savedProjects
  },

  async getInquiries({ filter = 'All', page = 1, pageSize = 4 } = {}) {
    if (!isLocalFallback()) {
      const storeProfile = readStore().profile
      const query = new URLSearchParams()
      if (storeProfile.email) query.set('email', storeProfile.email)
      if (storeProfile.phone) query.set('phone', storeProfile.phone)

      const response = await fetch(`${API_URL}/user/leads?${query.toString()}`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(await parseError(response))
      }

      const payload = await response.json()
      const all = payload?.data?.items || []
      const normalized = all.map((item) => ({
        id: item.id,
        date: item.date,
        serviceType: item.service_or_property,
        status: item.status,
        detail: item.full_details,
        preview: item.message_preview,
        source: item.source,
        leadType: item.lead_type,
      }))

      const filtered = filter === 'All' ? normalized : normalized.filter((item) => item.status === filter)
      const total = filtered.length
      const totalPages = Math.max(1, Math.ceil(total / pageSize))
      const safePage = Math.min(page, totalPages)
      const start = (safePage - 1) * pageSize

      return {
        items: filtered.slice(start, start + pageSize),
        total,
        page: safePage,
        totalPages,
      }
    }

    await delay()
    const all = readStore().inquiries
    const filtered = filter === 'All' ? all : all.filter((item) => item.status === filter)
    const total = filtered.length
    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    const safePage = Math.min(page, totalPages)
    const start = (safePage - 1) * pageSize

    return {
      items: filtered.slice(start, start + pageSize),
      total,
      page: safePage,
      totalPages,
    }
  },

  async deleteInquiry(id) {
    await delay()
    const next = updateStore((data) => ({
      ...data,
      inquiries: data.inquiries.filter((inquiry) => inquiry.id !== id),
    }))
    return next.inquiries
  },

  async getQuotes() {
    await delay()
    return readStore().quotes
  },

  async updateQuoteStatus(id, status) {
    await delay()
    const next = updateStore((data) => ({
      ...data,
      quotes: data.quotes.map((quote) => (quote.id === id ? { ...quote, status } : quote)),
    }))
    return next.quotes
  },

  async requestQuoteModification(id) {
    await delay()
    const next = updateStore((data) => ({
      ...data,
      quotes: data.quotes.map((quote) =>
        quote.id === id
          ? { ...quote, status: 'Pending', revisionCount: (quote.revisionCount || 0) + 1 }
          : quote
      ),
    }))
    return next.quotes
  },

  async getSettings() {
    await delay()
    return readStore().settings
  },

  async updateSettings(values) {
    await delay()
    const next = updateStore((data) => ({
      ...data,
      settings: {
        ...data.settings,
        ...values,
        notifications: {
          ...data.settings.notifications,
          ...values.notifications,
        },
        privacy: {
          ...data.settings.privacy,
          ...values.privacy,
        },
        linkedAccounts: {
          ...data.settings.linkedAccounts,
          ...values.linkedAccounts,
        },
      },
    }))
    return next.settings
  },

  async changePassword() {
    await delay()
    return { success: true }
  },

  async getExportData() {
    await delay(250)
    return readStore()
  },

  async deleteAccount() {
    await delay()
    writeStore(structuredClone(defaultData))
    return { success: true }
  },
}
