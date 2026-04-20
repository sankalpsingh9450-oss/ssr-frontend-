import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  FiChevronDown,
  FiChevronUp,
  FiFile,
  FiMessageCircle,
  FiMinus,
  FiPaperclip,
  FiSend,
  FiSmile,
  FiThumbsDown,
  FiThumbsUp,
  FiUser,
  FiX,
} from 'react-icons/fi'
import { SITE } from '../constants'
import { createChatLead, sendTranscriptEmail, trackChatEvent } from '../lib/chatbotApi'
import {
  buildLeadCapturePrompt,
  detectLanguage,
  getBotReply,
  getQuickReplies,
  humanHandoffLinks,
  nextLeadField,
} from '../lib/chatbotEngine'
import {
  getStoredLead,
  loadChatConversation,
  persistChatConversation,
  saveStoredLead,
} from '../lib/chatbotStorage'

const MAX_MESSAGE_LENGTH = 500
const EMOJIS = ['🙂', '👋', '🏗️', '🏠', '📞', '✨']
const initialLead = { name: '', email: '', phone: '', serviceInterest: '' }

function createMessage({
  role,
  text,
  suggestions = [],
  metadata = {},
  rating = null,
}) {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role,
    text,
    suggestions,
    metadata,
    rating,
    timestamp: new Date().toISOString(),
  }
}

function formatTimestamp(value) {
  return new Date(value).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function greetingMessage() {
  return createMessage({
    role: 'bot',
    text: `Hi, I’m the SSR Group Civil assistant. I can help with services, projects, pricing, quotes, business hours, callbacks, and support. ${buildLeadCapturePrompt(getStoredLead() || initialLead)}`,
    suggestions: getQuickReplies('default'),
  })
}

function isValidEmail(value = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function normalizePhone(value = '') {
  const digits = value.replace(/\D/g, '')
  const local = digits.startsWith('91') ? digits.slice(2) : digits
  return `+91${local.slice(0, 10)}`
}

function isValidPhone(value = '') {
  return /^\+91[6-9]\d{9}$/.test(value)
}

function resolveServiceInterest(value = '') {
  const normalized = value.toLowerCase()
  const matched = [
    'Residential Construction',
    'Commercial Projects',
    'Interior Design',
    'Property Search',
    'Materials Supply',
    'Project Planning & BOQ',
  ].find((service) => normalized.includes(service.toLowerCase()))

  return matched || value.trim()
}

export default function ChatbotWidget({ onQuoteClick }) {
  const navigate = useNavigate()
  const messageEndRef = useRef(null)
  const fileInputRef = useRef(null)

  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [unreadCount, setUnreadCount] = useState(1)
  const [language, setLanguage] = useState('en')
  const [lead, setLead] = useState(() => getStoredLead() || initialLead)
  const [conversationTurns, setConversationTurns] = useState(0)
  const [isOffline, setIsOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false)
  const [pendingAttachment, setPendingAttachment] = useState(null)
  const [leadCaptured, setLeadCaptured] = useState(Boolean(getStoredLead()?.serviceInterest))

  const handoffLinks = useMemo(() => humanHandoffLinks(), [])

  useEffect(() => {
    let mounted = true
    loadChatConversation().then((storedMessages) => {
      if (!mounted) return
      if (storedMessages.length) {
        setMessages(storedMessages)
        const turns = storedMessages.filter((message) => message.role === 'user').length
        setConversationTurns(turns)
      } else {
        setMessages([greetingMessage()])
      }
    })

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!messages.length) return
    persistChatConversation(messages)
  }, [messages])

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping, isOpen, isMinimized])

  useEffect(() => {
    const goOnline = () => setIsOffline(false)
    const goOffline = () => setIsOffline(true)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setUnreadCount(0)
    }
  }, [isOpen, isMinimized])

  const appendBotMessage = (message) => {
    setMessages((current) => [...current, message])
    if (!isOpen || isMinimized) {
      setUnreadCount((current) => current + 1)
    }
  }

  const simulateBotResponse = (message) => {
    setIsTyping(true)
    window.setTimeout(() => {
      appendBotMessage(message)
      setIsTyping(false)
    }, 700)
  }

  const captureLeadIfComplete = async (nextLead) => {
    const nextField = nextLeadField(nextLead)
    if (nextField || leadCaptured) return

    try {
      await createChatLead({
        ...nextLead,
        source: 'chatbot',
        language,
      })
      setLeadCaptured(true)
      trackChatEvent('chatbot_lead_captured', { serviceInterest: nextLead.serviceInterest })
      simulateBotResponse(
        createMessage({
          role: 'bot',
          text: `Thanks ${nextLead.name}. I’ve captured your details for ${nextLead.serviceInterest}. Our team can now prepare a quote or arrange a callback.`,
          suggestions: ['Talk to agent', 'WhatsApp support', 'View Services'],
          metadata: { type: 'lead-confirmation' },
        })
      )
    } catch (error) {
      simulateBotResponse(
        createMessage({
          role: 'bot',
          text: 'I saved your details locally, but the live handoff service is unavailable right now. You can still continue here or jump to WhatsApp support.',
          suggestions: ['WhatsApp support', 'Talk to agent', 'Contact Us'],
        })
      )
    }
  }

  const handleLeadField = async (text) => {
    const field = nextLeadField(lead)
    if (!field) return false

    const next = { ...lead }

    if (field === 'name') {
      next.name = text.trim()
      if (next.name.length < 2) {
        simulateBotResponse(createMessage({ role: 'bot', text: 'Please share your name so I can personalize the follow-up correctly.' }))
        return true
      }
    }

    if (field === 'email') {
      if (!isValidEmail(text.trim())) {
        simulateBotResponse(createMessage({ role: 'bot', text: 'That email address doesn’t look valid. Please share a valid email like name@example.com.' }))
        return true
      }
      next.email = text.trim()
    }

    if (field === 'phone') {
      const phone = normalizePhone(text)
      if (!isValidPhone(phone)) {
        simulateBotResponse(createMessage({ role: 'bot', text: 'Please share a valid Indian mobile number in +91 format, for example +919876543210.' }))
        return true
      }
      next.phone = phone
    }

    if (field === 'serviceInterest') {
      next.serviceInterest = resolveServiceInterest(text)
      if (!next.serviceInterest) {
        simulateBotResponse(createMessage({ role: 'bot', text: 'Please mention the service you need, like Residential Construction, Commercial Projects, Interior Design, or Materials Supply.' }))
        return true
      }
    }

    setLead(next)
    saveStoredLead(next)

    const nextField = nextLeadField(next)
    if (nextField) {
      simulateBotResponse(
        createMessage({
          role: 'bot',
          text: buildLeadCapturePrompt(next),
          suggestions: nextField === 'serviceInterest' ? getQuickReplies('lead') : [],
          metadata: { type: 'lead-capture' },
        })
      )
    } else {
      await captureLeadIfComplete(next)
    }

    return true
  }

  const handleSpecialAction = async (text) => {
    const normalized = text.toLowerCase()

    if (normalized === 'get quote' || normalized === 'start lead capture') {
      simulateBotResponse(
        createMessage({
          role: 'bot',
          text: buildLeadCapturePrompt(lead),
          suggestions: getQuickReplies('lead'),
          metadata: { type: 'lead-capture' },
        })
      )
      return true
    }

    if (normalized === 'view services') {
      navigate('/services')
      return true
    }

    if (normalized === 'contact us') {
      navigate('/contact')
      return true
    }

    if (normalized === 'talk to agent' || normalized === 'schedule callback') {
      simulateBotResponse(
        createMessage({
          role: 'bot',
          text: 'A human callback is the best next step here. I can keep your lead in the queue, or you can jump directly to WhatsApp support now.',
          suggestions: ['WhatsApp support', 'Email transcript', 'Get Quote'],
          metadata: { type: 'handoff' },
        })
      )
      return true
    }

    if (normalized === 'whatsapp support') {
      window.open(handoffLinks.whatsapp, '_blank', 'noopener,noreferrer')
      return true
    }

    if (normalized === 'email transcript') {
      if (!lead.email) {
        simulateBotResponse(createMessage({ role: 'bot', text: 'Please share your email first so I can send the transcript.' }))
        return true
      }

      try {
        await sendTranscriptEmail({
          email: lead.email,
          messages,
        })
        simulateBotResponse(createMessage({ role: 'bot', text: `Done — I’ve prepared the transcript for ${lead.email}.`, suggestions: ['Talk to agent', 'WhatsApp support'] }))
      } catch {
        simulateBotResponse(createMessage({ role: 'bot', text: 'I could not email the transcript right now, but I can still connect you to WhatsApp support.' }))
      }
      return true
    }

    if (normalized === 'free consultation') {
      if (onQuoteClick) onQuoteClick()
      return true
    }

    return false
  }

  const submitMessage = async (textOverride) => {
    const text = (textOverride ?? draft).trim()
    if (!text || text.length > MAX_MESSAGE_LENGTH) return

    const userMessage = createMessage({
      role: 'user',
      text,
      metadata: pendingAttachment ? { attachment: pendingAttachment } : {},
    })

    setMessages((current) => [...current, userMessage])
    setDraft('')
    setShowEmojiPicker(false)
    setPendingAttachment(null)
    setConversationTurns((current) => current + 1)
    trackChatEvent('chatbot_message_sent', { length: text.length })

    const detectedLanguage = detectLanguage(text)
    setLanguage(detectedLanguage)

    if (isOffline) {
      simulateBotResponse(
        createMessage({
          role: 'bot',
          text:
            detectedLanguage === 'hi'
              ? 'आप अभी ऑफलाइन हैं। संदेश सुरक्षित है, लेकिन लाइव सहायता के लिए कनेक्शन वापस आने पर फिर कोशिश करें।'
              : 'You appear to be offline. Your message is saved locally, but live handoff will need an internet connection.',
          suggestions: ['WhatsApp support', 'Contact Us'],
        })
      )
      return
    }

    if (await handleSpecialAction(text)) {
      return
    }

    if (await handleLeadField(text)) {
      return
    }

    const reply = getBotReply(text, {
      language: detectedLanguage,
      exchangeCount: conversationTurns + 1,
    })

    simulateBotResponse(
      createMessage({
        role: 'bot',
        text: reply.text,
        suggestions: reply.suggestions,
        metadata: {
          sentiment: reply.sentiment,
          handoff: conversationTurns + 1 >= 3,
        },
      })
    )
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submitMessage()
    }
  }

  const handleQuickReply = (text) => {
    if (text === 'View Services') {
      navigate('/services')
      return
    }

    if (text === 'Contact Us') {
      navigate('/contact')
      return
    }

    setDraft(text)
    submitMessage(text)
  }

  const handleAttachment = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const attachment = { name: file.name, size: file.size, type: file.type }
    setPendingAttachment(attachment)
    simulateBotResponse(
      createMessage({
        role: 'bot',
        text: `I’ve attached "${file.name}" to this conversation context. You can now describe the inquiry and I’ll keep the attachment reference ready for a human follow-up.`,
        suggestions: ['Get Quote', 'Talk to agent'],
      })
    )
  }

  const rateBotMessage = (id, rating) => {
    setMessages((current) =>
      current.map((message) => (message.id === id ? { ...message, rating } : message))
    )
    trackChatEvent('chatbot_response_rated', { rating })
  }

  const lastBotMessage = [...messages].reverse().find((message) => message.role === 'bot')

  return (
    <div className="fixed bottom-4 right-4 z-[1200] flex flex-col items-end gap-3 sm:bottom-5 sm:right-5">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className={`w-[min(calc(100vw-1rem),24rem)] overflow-hidden rounded-[28px] border border-[#d4af37]/20 bg-[#0b1426] text-white shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:w-[24rem] ${isMinimized ? 'h-auto' : ''}`}
            role="dialog"
            aria-label="SSR Group Civil chatbot"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-[linear-gradient(135deg,#1a2540,#0d1728)] px-4 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-[#d4af37]/30 bg-white/10">
                  <img src={SITE.logo} alt="SSR assistant" className="h-full w-full object-cover" />
                  <span className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">SSR Group Assistant</p>
                  <p className="truncate text-xs text-white/60">
                    {isOffline ? 'Offline mode: saved locally' : 'Online • AI-guided support'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMinimized((current) => !current)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:text-white"
                  aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
                >
                  {isMinimized ? <FiChevronUp /> : <FiMinus />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false)
                    setIsMinimized(false)
                  }}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:text-white"
                  aria-label="Close chat"
                >
                  <FiX />
                </button>
              </div>
            </div>

            {!isMinimized ? (
              <>
                <div className="flex max-h-[26rem] min-h-[22rem] flex-col overflow-hidden">
                  <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[88%] ${message.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                          <div
                            className={`rounded-[22px] px-4 py-3 text-sm leading-6 ${
                              message.role === 'user'
                                ? 'bg-[#234b85] text-white'
                                : 'border border-white/10 bg-white/[0.06] text-white/88'
                            }`}
                          >
                            {message.text}
                            {message.metadata?.attachment ? (
                              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs">
                                <FiFile />
                                {message.metadata.attachment.name}
                              </div>
                            ) : null}
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-[11px] text-white/40">
                            <span>{formatTimestamp(message.timestamp)}</span>
                            {message.role === 'bot' ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => rateBotMessage(message.id, 'up')}
                                  className={`rounded-full p-1.5 transition ${message.rating === 'up' ? 'bg-emerald-500/15 text-emerald-300' : 'hover:bg-white/10 hover:text-white/70'}`}
                                  aria-label="Rate response helpful"
                                >
                                  <FiThumbsUp />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => rateBotMessage(message.id, 'down')}
                                  className={`rounded-full p-1.5 transition ${message.rating === 'down' ? 'bg-rose-500/15 text-rose-300' : 'hover:bg-white/10 hover:text-white/70'}`}
                                  aria-label="Rate response unhelpful"
                                >
                                  <FiThumbsDown />
                                </button>
                              </>
                            ) : null}
                          </div>

                          {message.role === 'bot' && message.suggestions?.length ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {message.suggestions.map((suggestion) => (
                                <button
                                  key={`${message.id}-${suggestion}`}
                                  type="button"
                                  onClick={() => handleQuickReply(suggestion)}
                                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/75 transition hover:border-[#d4af37]/40 hover:text-[#f1cf6f]"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ))}

                    {isTyping ? (
                      <div className="flex justify-start">
                        <div className="rounded-[22px] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white/70">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex gap-1">
                              <span className="h-2 w-2 animate-bounce rounded-full bg-[#d4af37]" />
                              <span className="h-2 w-2 animate-bounce rounded-full bg-[#d4af37] [animation-delay:120ms]" />
                              <span className="h-2 w-2 animate-bounce rounded-full bg-[#d4af37] [animation-delay:240ms]" />
                            </span>
                            Bot is typing...
                          </div>
                        </div>
                      </div>
                    ) : null}
                    <div ref={messageEndRef} />
                  </div>

                  {lastBotMessage?.metadata?.handoff ? (
                    <div className="border-t border-white/10 px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={handoffLinks.whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full bg-[#d4af37] px-3 py-2 text-xs font-bold text-[#1a2540]"
                        >
                          WhatsApp support
                        </a>
                        <button
                          type="button"
                          onClick={() => handleQuickReply('Email transcript')}
                          className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-white/75"
                        >
                          Email transcript
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickReply('Talk to agent')}
                          className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-white/75"
                        >
                          Talk to agent
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="border-t border-white/10 px-4 py-4">
                  {pendingAttachment ? (
                    <div className="mb-3 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/70">
                      <span className="inline-flex items-center gap-2">
                        <FiPaperclip />
                        {pendingAttachment.name}
                      </span>
                      <button type="button" onClick={() => setPendingAttachment(null)} className="rounded-full p-1 hover:bg-white/10">
                        <FiX />
                      </button>
                    </div>
                  ) : null}

                  <div className="relative">
                    <textarea
                      value={draft}
                      onChange={(event) => setDraft(event.target.value.slice(0, MAX_MESSAGE_LENGTH))}
                      onKeyDown={handleKeyDown}
                      rows={3}
                      placeholder="Ask about services, pricing, quotes, or callback support..."
                      className="w-full resize-none rounded-[22px] border border-white/10 bg-white/[0.05] px-4 py-3 pr-28 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#d4af37]/40"
                    />
                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker((current) => !current)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition hover:text-white"
                        aria-label="Emoji picker"
                      >
                        <FiSmile />
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition hover:text-white"
                        aria-label="Attach a file"
                      >
                        <FiPaperclip />
                      </button>
                      <button
                        type="button"
                        onClick={() => submitMessage()}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#d4af37] text-[#1a2540] transition hover:bg-[#e7c55d]"
                        aria-label="Send message"
                      >
                        <FiSend />
                      </button>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleAttachment}
                  />

                  {showEmojiPicker ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setDraft((current) => `${current}${emoji}`)}
                          className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-lg"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-3 flex items-center justify-between text-[11px] text-white/40">
                    <span>{draft.length}/{MAX_MESSAGE_LENGTH}</span>
                    <span>{language === 'hi' ? 'Hindi mode detected' : 'English mode'}</span>
                  </div>
                </div>
              </>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={() => {
          setIsOpen((current) => !current)
          setIsMinimized(false)
          trackChatEvent('chatbot_widget_toggled', { open: !isOpen })
        }}
        className="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#d4af37,#f0d271)] text-[#1a2540] shadow-[0_18px_45px_rgba(212,175,55,0.38)]"
        aria-label={isOpen ? 'Hide chatbot' : 'Open chatbot'}
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#d4af37]/30" />
        <span className="relative z-10 text-[28px]">
          <FiMessageCircle />
        </span>
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-rose-500 px-1 text-xs font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : null}
      </motion.button>
    </div>
  )
}
