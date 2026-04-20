import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ForgotPassword from '../../src/pages/ForgotPassword'
import { renderWithProviders } from '../utils/renderWithProviders'

const sendOtpMock = jest.fn()
const resendOtpMock = jest.fn()
const resetPasswordMock = jest.fn()
const toastSuccess = jest.fn()
const toastError = jest.fn()

jest.mock('../../src/lib/authApi', () => ({
  authApi: {
    sendOtp: (...args) => sendOtpMock(...args),
    resendOtp: (...args) => resendOtpMock(...args),
    resetPassword: (...args) => resetPasswordMock(...args),
  },
}))

jest.mock('react-hot-toast', () => ({
  toast: {
    success: (...args) => toastSuccess(...args),
    error: (...args) => toastError(...args),
  },
}))

describe('ForgotPassword flow', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('sends OTP and resets password successfully', async () => {
    sendOtpMock.mockResolvedValue({ message: 'OTP sent to your email address.' })
    resendOtpMock.mockResolvedValue({ message: 'A fresh OTP has been sent.' })
    resetPasswordMock.mockResolvedValue({ message: 'Password reset successfully.' })

    renderWithProviders(<ForgotPassword />)
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/email address/i), 'client@example.com')
    await user.click(screen.getByRole('button', { name: /send otp/i }))

    await waitFor(() => expect(sendOtpMock).toHaveBeenCalledWith({ email: 'client@example.com' }))
    expect(await screen.findByText(/otp sent to/i)).toBeInTheDocument()

    await user.type(screen.getByLabelText(/^otp$/i), '123456')
    await user.type(screen.getByLabelText(/new password/i), 'Password123')
    await user.type(screen.getByLabelText(/confirm password/i), 'Password123')
    await user.click(screen.getByRole('button', { name: /reset password/i }))

    await waitFor(() =>
      expect(resetPasswordMock).toHaveBeenCalledWith({
        email: 'client@example.com',
        otp: '123456',
        newPassword: 'Password123',
        confirmPassword: 'Password123',
      })
    )

    expect(await screen.findByText(/password updated/i)).toBeInTheDocument()
    expect(toastSuccess).toHaveBeenCalled()
  })
})
