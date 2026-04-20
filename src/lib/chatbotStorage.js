const DB_NAME = 'ssr-chatbot-db'
const STORE_NAME = 'conversations'
const DB_VERSION = 1
const CONVERSATION_KEY = 'primary'
const LEAD_KEY = 'ssr-chatbot-lead'

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      resolve(null)
      return
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function readFromIndexedDb() {
  const db = await openDatabase()
  if (!db) return null

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(CONVERSATION_KEY)

    request.onsuccess = () => resolve(request.result?.messages || [])
    request.onerror = () => reject(request.error)
  })
}

async function writeToIndexedDb(messages) {
  const db = await openDatabase()
  if (!db) return false

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put({ id: CONVERSATION_KEY, messages, updatedAt: Date.now() })

    request.onsuccess = () => resolve(true)
    request.onerror = () => reject(request.error)
  })
}

export async function loadChatConversation() {
  try {
    const messages = await readFromIndexedDb()
    if (messages?.length) return messages
  } catch {
    // Fallback handled below
  }

  if (typeof window === 'undefined') return []

  try {
    return JSON.parse(window.localStorage.getItem('ssr-chatbot-history') || '[]')
  } catch {
    return []
  }
}

export async function persistChatConversation(messages) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem('ssr-chatbot-history', JSON.stringify(messages))

  try {
    await writeToIndexedDb(messages)
  } catch {
    // Local storage fallback already succeeded
  }
}

export function getStoredLead() {
  if (typeof window === 'undefined') return null

  try {
    return JSON.parse(window.localStorage.getItem(LEAD_KEY) || 'null')
  } catch {
    return null
  }
}

export function saveStoredLead(lead) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(LEAD_KEY, JSON.stringify(lead))
}

export function clearStoredLead() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(LEAD_KEY)
}
