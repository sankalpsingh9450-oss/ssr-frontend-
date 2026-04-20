import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Register from '../../src/pages/Register'
import { renderWithProviders } from '../utils/renderWithProviders'

const navigateMock = jest.fn()
const toastSuccess = jest.fn()
const registerMock = jest.fn()
const setSessionMock = jest.fn()

jest.mock('../../src/lib/authApi', () => ({
  authApi: {
    register: (...args) => registerMock(...args),
    getGoogleAuthUrl: jest.fn(() => ''),
  },
}))

jest.mock('../../src/lib/session', () => ({
  setSession: (...args) => setSessionMock(...args),
}))

jest.mock('react-hot-toast', () => ({
  toast: {
    success: (...args) => toastSuccess(...args),
    error: jest.fn(),
  },
}))

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

describe('Register page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('normalizes Indian phone and submits registration', async () => {
    registerMock.mockResolvedValue({
      message: 'Account created successfully.',
      user: { email: 'new@example.com', name: 'New Client' },
    })

    renderWithProviders(<Register />)
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/full name/i), 'New Client')
    await user.type(screen.getByLabelText(/email address/i), 'new@example.com')
    await user.clear(screen.getByLabelText(/phone number/i))
    await user.type(screen.getByLabelText(/phone number/i), '9876543210')
    await user.type(screen.getByLabelText(/^password$/i), 'Password123')
    await user.type(screen.getByLabelText(/confirm password/i), 'Password123')
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => expect(registerMock).toHaveBeenCalled())
    expect(registerMock.mock.calls[0][0].phone).toBe('+919876543210')
    expect(setSessionMock).toHaveBeenCalled()
    expect(navigateMock).toHaveBeenCalledWith('/profile')
  })
})
