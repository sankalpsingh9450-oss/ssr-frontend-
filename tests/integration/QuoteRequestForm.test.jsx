import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import QuoteRequestForm from '../../src/components/forms/QuoteRequestForm'
import { renderWithProviders } from '../utils/renderWithProviders'

expect.extend(toHaveNoViolations)

const submitQuoteRequestMock = jest.fn()
const toastSuccess = jest.fn()
const toastError = jest.fn()

jest.mock('../../src/lib/formApi', () => ({
  formApi: {
    submitQuoteRequest: (...args) => submitQuoteRequestMock(...args),
  },
}))

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: (...args) => toastSuccess(...args),
    error: (...args) => toastError(...args),
  },
}))

describe('QuoteRequestForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    window.localStorage.clear()
  })

  test('validates, submits, and shows success state', async () => {
    submitQuoteRequestMock.mockResolvedValue({ message: 'Submitted successfully.' })
    const onSubmitted = jest.fn()
    renderWithProviders(<QuoteRequestForm onSubmitted={onSubmitted} />)
    const user = userEvent.setup()

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'SSR Client' } })
    fireEvent.change(screen.getByLabelText(/^phone/i), { target: { value: '+919876543210' } })
    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'client@example.com' } })
    await user.selectOptions(screen.getByLabelText(/service type/i), 'Residential Construction')
    fireEvent.change(screen.getByLabelText(/project description/i), {
      target: {
        value: 'Need a detailed quote for a 2200 sq ft villa with premium finishing.',
      },
    })
    await user.click(screen.getByLabelText(/within 3 months/i))
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => expect(submitQuoteRequestMock).toHaveBeenCalled())
    expect(await screen.findByText(/quote request received/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /done/i }))
    expect(onSubmitted).toHaveBeenCalled()
    expect(toastSuccess).toHaveBeenCalled()
  })

  test('shows attachment validation error', async () => {
    renderWithProviders(<QuoteRequestForm />)
    const user = userEvent.setup()
    const file = new File(['x'.repeat(11 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' })

    await user.upload(screen.getByLabelText(/attachments/i), file)

    expect(await screen.findByText(/total attachment size must stay under 10mb/i)).toBeInTheDocument()
  })

  test('is accessible in default state', async () => {
    const { container } = renderWithProviders(<QuoteRequestForm />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
