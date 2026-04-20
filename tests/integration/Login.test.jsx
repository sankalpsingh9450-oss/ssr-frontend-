import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from '../../src/pages/Login'
import { renderWithProviders } from '../utils/renderWithProviders'

const navigateMock = jest.fn()
const toastSuccess = jest.fn()
const toastError = jest.fn()
const loginMock = jest.fn()
const setSessionMock = jest.fn()

jest.mock('../../src/lib/authApi', () => ({
  authApi: {
    login: (...args) => loginMock(...args),
    getGoogleAuthUrl: jest.fn(() => ''),
  },
}))

jest.mock('../../src/lib/session', () => ({
  setSession: (...args) => setSessionMock(...args),
}))

jest.mock('react-hot-toast', () => ({
  toast: {
    success: (...args) => toastSuccess(...args),
    error: (...args) => toastError(...args),
  },
}))

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

describe('Login page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('submits valid credentials and navigates to profile', async () => {
    loginMock.mockResolvedValue({
      message: 'Signed in successfully.',
      user: { email: 'client@example.com', name: 'SSR Client' },
    })

    renderWithProviders(<Login />)
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/email address/i), 'client@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'Password123')
    await waitFor(() => expect(screen.getByRole('button', { name: /sign in/i })).toBeEnabled())
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => expect(loginMock).toHaveBeenCalled())
    expect(setSessionMock).toHaveBeenCalledWith({
      email: 'client@example.com',
      name: 'SSR Client',
    })
    expect(toastSuccess).toHaveBeenCalled()
    expect(navigateMock).toHaveBeenCalledWith('/profile')
  })

  test('shows validation error for invalid email', async () => {
    renderWithProviders(<Login />)
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/email address/i), 'invalid-email')
    await user.type(screen.getByLabelText(/^password$/i), 'Password123')
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled()

    expect(await screen.findByText(/enter a valid email address/i)).toBeInTheDocument()
  })
})
