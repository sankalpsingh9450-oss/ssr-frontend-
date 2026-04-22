import { fireEvent, screen, waitFor } from '@testing-library/react'
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

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'SSR Client' } })
    fireEvent.change(screen.getByLabelText(/^phone \*/i), { target: { value: '+919876543210' } })
    fireEvent.change(screen.getByLabelText(/^email \*/i), { target: { value: 'client@example.com' } })
    await user.selectOptions(screen.getByLabelText(/subject/i), 'Construction Quote')
    fireEvent.change(screen.getByLabelText(/^message/i), {
      target: {
        value: 'I need a full construction estimate for a planned residential project in Greater Noida West.',
      },
    })
    await user.click(screen.getByLabelText(/whatsapp/i))
    await user.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => expect(submitContactInquiryMock).toHaveBeenCalled())
    expect(await screen.findByText(/message sent/i)).toBeInTheDocument()
    expect(toastSuccess).toHaveBeenCalled()
  })
})
