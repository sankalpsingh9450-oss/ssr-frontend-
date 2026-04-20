import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChatbotWidget from '../../src/components/ChatbotWidget'
import { renderWithProviders } from '../utils/renderWithProviders'

const createChatLeadMock = jest.fn()
const sendTranscriptEmailMock = jest.fn()
const trackChatEventMock = jest.fn()
const loadConversationMock = jest.fn()
const persistConversationMock = jest.fn()
const getStoredLeadMock = jest.fn()
const saveStoredLeadMock = jest.fn()

jest.mock('../../src/lib/chatbotApi', () => ({
  createChatLead: (...args) => createChatLeadMock(...args),
  sendTranscriptEmail: (...args) => sendTranscriptEmailMock(...args),
  trackChatEvent: (...args) => trackChatEventMock(...args),
}))

jest.mock('../../src/lib/chatbotStorage', () => ({
  loadChatConversation: (...args) => loadConversationMock(...args),
  persistChatConversation: (...args) => persistConversationMock(...args),
  getStoredLead: (...args) => getStoredLeadMock(...args),
  saveStoredLead: (...args) => saveStoredLeadMock(...args),
}))

describe('ChatbotWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    loadConversationMock.mockResolvedValue([])
    getStoredLeadMock.mockReturnValue(null)
  })

  test('opens chat and answers a pricing question', async () => {
    getStoredLeadMock.mockReturnValue({
      name: 'SSR Client',
      email: 'client@example.com',
      phone: '+919876543210',
      serviceInterest: 'Residential Construction',
    })

    renderWithProviders(<ChatbotWidget />)
    const user = userEvent.setup()

    await user.click(screen.getByLabelText(/open chatbot/i))
    expect(await screen.findByText(/ssr group civil assistant/i)).toBeInTheDocument()

    const input = screen.getByPlaceholderText(/ask about services, pricing, quotes/i)
    await user.type(input, "What's your pricing?")
    await user.click(screen.getByLabelText(/send message/i))

    expect(await screen.findByText(/pricing depends on scope/i, {}, { timeout: 3000 })).toBeInTheDocument()
    expect(trackChatEventMock).toHaveBeenCalledWith('chatbot_message_sent', expect.any(Object))
  })

  test('starts lead capture from quick reply', async () => {
    getStoredLeadMock.mockReturnValue(null)
    renderWithProviders(<ChatbotWidget />)
    const user = userEvent.setup()

    await user.click(screen.getByLabelText(/open chatbot/i))
    await screen.findByText(/ssr group civil assistant/i)
    await user.click(screen.getByRole('button', { name: /get quote/i }))

    await waitFor(() =>
      expect(screen.getByText(/may i have your name/i)).toBeInTheDocument()
    )
  })
})
