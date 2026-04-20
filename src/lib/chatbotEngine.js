import { CONTACT_SUBJECTS, SERVICES, SITE, WHATSAPP_URL, PROJECTS } from '../constants'

export const QUICK_REPLIES = ['Get Quote', 'View Services', 'Contact Us']

const serviceNames = SERVICES.map((service) => service.title).join(', ')
const residentialProjects = PROJECTS.filter((project) => project.type === 'Residential').map((project) => project.title).join(', ')
const commercialProjects = PROJECTS.filter((project) => project.type === 'Commercial').map((project) => project.title).join(', ')

const KNOWLEDGE_BASE = [
  {
    match: ['what services do you offer', 'services', 'what can you do'],
    answer: `We offer ${serviceNames}. If you tell me your requirement, I can guide you to the right service quickly.`,
    suggestions: ['Residential Construction', 'Commercial Projects', 'Get Quote'],
  },
  {
    match: ['residential construction', 'do you do residential', 'home construction'],
    answer: 'Yes. We handle residential construction including custom homes, villas, apartments, G+2 floors, BOQ planning, and finishing support across Delhi NCR.',
    suggestions: ['Get Quote', 'View Services', 'Talk to agent'],
  },
  {
    match: ['commercial projects', 'commercial construction', 'office project'],
    answer: 'Yes. We support commercial builds such as office complexes, retail spaces, mixed-use developments, and structured project planning for business needs.',
    suggestions: ['Commercial project examples', 'Get Quote', 'Talk to agent'],
  },
  {
    match: ['interior design', 'interior', 'interior work'],
    answer: 'Our interior and finishing support covers modular kitchens, false ceilings, premium finishes, modern layouts, and tailored execution for homes and offices.',
    suggestions: ['Get Quote', 'Contact Us', 'View Services'],
  },
  {
    match: ['completed projects', 'can i see your completed projects', 'portfolio'],
    answer: 'You can explore our featured portfolio on the Projects area of the homepage. We currently highlight premium residential and commercial work with location and status details.',
    suggestions: ['Residential projects', 'Commercial project examples', 'View Services'],
  },
  {
    match: ['residential projects', 'do you have residential projects'],
    answer: `Yes. Some residential examples include ${residentialProjects || 'our villa, apartment, and independent floor developments'}.`,
    suggestions: ['Get Quote', 'Talk to agent', 'Contact Us'],
  },
  {
    match: ['commercial project examples', 'commercial projects example'],
    answer: `Yes. Commercial examples include ${commercialProjects || 'our office, retail, and mixed-use project set'}. We can also arrange a guided callback for relevant references.`,
    suggestions: ['Schedule callback', 'Get Quote', 'Talk to agent'],
  },
  {
    match: ['how do i get a quote', 'get quote', 'quotation'],
    answer: 'The fastest path is to share your name, phone, email, and service interest here. I can capture that lead and route it to the team for a free quotation or BOQ discussion.',
    suggestions: ['Start lead capture', 'Talk to agent', 'WhatsApp support'],
  },
  {
    match: ['pricing', "what's your pricing", 'cost'],
    answer: 'Pricing depends on scope, built-up area, materials, site condition, finish level, and project type. We usually recommend a short consultation so we can prepare a realistic estimate.',
    suggestions: ['Get Quote', 'Schedule callback', 'Free consultation'],
  },
  {
    match: ['free consultation', 'do you offer free consultations'],
    answer: 'Yes. We offer free initial consultations and BOQ-oriented guidance for qualified enquiries. I can help capture your details right here.',
    suggestions: ['Start lead capture', 'Contact Us', 'WhatsApp support'],
  },
  {
    match: ['how can i contact you', 'contact details', 'contact us'],
    answer: `You can reach us on ${SITE.phone}, email ${SITE.email}, or visit us at ${SITE.address}. Business hours are ${SITE.hours}.`,
    suggestions: ['WhatsApp support', 'Schedule callback', 'Talk to agent'],
  },
  {
    match: ['business hours', 'timing', 'office hours'],
    answer: `Our business hours are ${SITE.hours}. For urgent enquiries, WhatsApp is usually the quickest path.`,
    suggestions: ['WhatsApp support', 'Contact Us', 'Schedule callback'],
  },
  {
    match: ['schedule a callback', 'callback', 'call back'],
    answer: 'Yes, we can schedule a callback. If you share your contact details and service interest, I will prepare the lead for the team and suggest WhatsApp as a faster handoff too.',
    suggestions: ['Start lead capture', 'WhatsApp support', 'Talk to agent'],
  },
  {
    match: ['support after completion', 'after completion', 'post completion'],
    answer: 'Yes. We support clients beyond execution through follow-up coordination, issue routing, and practical post-completion assistance where applicable.',
    suggestions: ['Contact Us', 'Talk to agent', 'View Services'],
  },
  {
    match: ['what makes you different', 'why choose you', 'different'],
    answer: 'SSR Group Civil combines engineering discipline, construction execution, material sourcing, BOQ planning, and lead handling under one system. That reduces fragmented vendor coordination and improves transparency.',
    suggestions: ['View Services', 'Get Quote', 'Talk to agent'],
  },
  {
    match: ['how long have you been in business', 'company history', 'years in business'],
    answer: 'SSR Group Civil presents itself as a premium engineering, construction, and development brand focused on transparent pricing, BOQ-led planning, and structured delivery across Delhi NCR.',
    suggestions: ['What services do you offer?', 'Get Quote', 'Talk to agent'],
  },
  {
    match: ['where do you operate', 'service areas', 'location'],
    answer: 'We primarily operate across Delhi NCR, including Greater Noida West, Noida Extension, and nearby residential and commercial growth corridors.',
    suggestions: ['Contact Us', 'Schedule callback', 'Get Quote'],
  },
  {
    match: ['certifications', 'credentials'],
    answer: 'We highlight trust through structured planning, transparent BOQ support, and premium execution positioning. If you need documentation or credentials for a live project, a human follow-up is best.',
    suggestions: ['Talk to agent', 'Schedule callback', 'Contact Us'],
  },
]

const HINDI_GREETINGS = [
  'namaste',
  'नमस्ते',
  'हेलो',
  'hello in hindi',
]

const FRUSTRATED_KEYWORDS = ['angry', 'frustrated', 'not working', 'bad', 'worst', 'issue', 'problem', 'complaint', 'slow', 'upset']

export function detectLanguage(text = '') {
  const value = text.toLowerCase()
  if (HINDI_GREETINGS.some((keyword) => value.includes(keyword)) || /[\u0900-\u097F]/.test(text)) {
    return 'hi'
  }
  return 'en'
}

export function detectSentiment(text = '') {
  const value = text.toLowerCase()
  if (FRUSTRATED_KEYWORDS.some((keyword) => value.includes(keyword))) {
    return 'frustrated'
  }
  return 'neutral'
}

export function getQuickReplies(section = 'default') {
  const map = {
    default: QUICK_REPLIES,
    handoff: ['Talk to agent', 'WhatsApp support', 'Email transcript'],
    lead: ['Residential Construction', 'Commercial Projects', 'Interior Design'],
  }

  return map[section] || QUICK_REPLIES
}

export function getBotReply(message, { language = 'en', exchangeCount = 0 } = {}) {
  const value = message.toLowerCase()
  const sentiment = detectSentiment(message)

  if (sentiment === 'frustrated') {
    return {
      text:
        language === 'hi'
          ? 'मुझे खेद है कि आपको परेशानी हो रही है। मैं अभी आपकी बात सही टीम तक पहुंचाने में मदद कर सकता हूँ, या आप सीधे WhatsApp सपोर्ट से भी जुड़ सकते हैं।'
          : "I'm sorry you're having a frustrating experience. I can help route this to the right team right away, or connect you to WhatsApp support.",
      suggestions: ['Talk to agent', 'WhatsApp support', 'Contact Us'],
      sentiment,
    }
  }

  const matched = KNOWLEDGE_BASE.find((item) => item.match.some((keyword) => value.includes(keyword)))

  if (matched) {
    const suggestions = exchangeCount >= 3
      ? Array.from(new Set([...matched.suggestions, 'Talk to agent']))
      : matched.suggestions

    return {
      text: matched.answer,
      suggestions,
      sentiment,
    }
  }

  if (language === 'hi') {
    return {
      text: 'मैं आपकी मदद कर सकता हूँ। आप सेवा, प्रोजेक्ट, कीमत, कोटेशन, कॉन्टैक्ट, या callback के बारे में पूछ सकते हैं। अगर चाहें तो मैं आपकी जानकारी लेकर टीम तक पहुंचा सकता हूँ।',
      suggestions: ['Get Quote', 'Contact Us', 'Talk to agent'],
      sentiment,
    }
  }

  return {
    text: `I can help with services, project examples, pricing, quotations, contact details, business hours, and callbacks. If you'd like, I can also capture your lead for the ${CONTACT_SUBJECTS[0]} or another service right here.`,
    suggestions: exchangeCount >= 3 ? ['Talk to agent', 'WhatsApp support', 'Get Quote'] : QUICK_REPLIES,
    sentiment,
  }
}

export function buildLeadCapturePrompt(lead = {}) {
  if (!lead.name) return 'Before we continue, may I have your name so I can personalize the conversation?'
  if (!lead.email) return 'Please share your email address so we can send your quotation or callback confirmation.'
  if (!lead.phone) return 'Please share your phone number in +91 format so the team can reach you quickly.'
  if (!lead.serviceInterest) return 'Which service are you interested in? For example: Residential Construction, Commercial Projects, Interior Design, Materials Supply, or Property Search.'
  return 'Thanks. I have the basics. I can now help with a quote, callback, or service guidance.'
}

export function nextLeadField(lead = {}) {
  if (!lead.name) return 'name'
  if (!lead.email) return 'email'
  if (!lead.phone) return 'phone'
  if (!lead.serviceInterest) return 'serviceInterest'
  return null
}

export function humanHandoffLinks() {
  return {
    whatsapp: WHATSAPP_URL,
    email: `mailto:${SITE.email}`,
  }
}
