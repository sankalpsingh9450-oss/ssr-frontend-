import {
  forgotPasswordResetSchema,
  getPasswordStrength,
  loginSchema,
  normalizeIndianPhone,
  registerSchema,
} from '../../src/lib/authSchemas'

describe('authSchemas', () => {
  test('accepts valid login data', () => {
    expect(() =>
      loginSchema.parse({
        email: 'user@example.com',
        password: 'Secret123',
        rememberMe: true,
      })
    ).not.toThrow()
  })

  test('rejects mismatched register passwords', () => {
    expect(() =>
      registerSchema.parse({
        fullName: 'SSR Client',
        email: 'client@example.com',
        phone: '+919876543210',
        password: 'Secret123',
        confirmPassword: 'Secret124',
        termsAccepted: true,
      })
    ).toThrow('Passwords do not match')
  })

  test('requires valid OTP during password reset', () => {
    expect(() =>
      forgotPasswordResetSchema.parse({
        otp: '123',
        newPassword: 'Secret123',
        confirmPassword: 'Secret123',
      })
    ).toThrow('Enter the 6-digit OTP')
  })

  test('scores password strength correctly', () => {
    expect(getPasswordStrength('abc')).toEqual({ score: 1, label: 'Weak' })
    expect(getPasswordStrength('Secret123')).toEqual({ score: 4, label: 'Good' })
    expect(getPasswordStrength('Secret123!')).toEqual({ score: 5, label: 'Strong' })
  })

  test('normalizes Indian phone numbers with +91 prefix', () => {
    expect(normalizeIndianPhone('98765 43210')).toBe('+919876543210')
    expect(normalizeIndianPhone('+91-9876543210')).toBe('+919876543210')
  })
})
