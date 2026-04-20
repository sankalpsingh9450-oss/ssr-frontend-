import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactInquiryForm from '../../src/components/forms/ContactInquiryForm'
import { renderWithProviders } from '../utils/renderWithProviders'

const submitContactInquiryMock = jest.fn()
const toastSuccess = jest.fn()
const toastError = jest.fn()

jest.mock('../../src/lib/formApi', () => ({
  formApi: {
    submitContactInquiry: (...args) => submitContactInquiryMock(...args),
  },
}))

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: (...args) => toastSuccess(...args),
    error: (...args) => toastError(...args),
  },
}))

describe('ContactInquiryForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    window.localStorage.clear()
  })

  test('submits contact inquiry successfully', async () => {
    submitContactInquiryMock.mockResolvedValue({ message: 'Sent successfully.' })
    renderWithProviders(<ContactInquiryForm />)
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/full name/i), 'SSR Client')
    await user.type(screen.getByLabelText(/^phone \*/i), '+919876543210')
    await user.type(screen.getByLabelText(/^email \*/i), 'client@example.com')
    await user.selectOptions(screen.getByLabelText(/subject/i), 'Construction Quote')
    await user.type(screen.getByLabelText(/^message/i), 'I need a full construction estimate for a planned residential project in Greater Noida West.')
    await user.click(screen.getByLabelText(/whatsapp/i))
    await user.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => expect(submitContactInquiryMock).toHaveBeenCalled())
    expect(await screen.findByText(/message sent/i)).toBeInTheDocument()
    expect(toastSuccess).toHaveBeenCalled()
  })
})
