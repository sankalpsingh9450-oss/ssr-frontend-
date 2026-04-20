import { normalizeProfileInput, passwordChangeSchema, profileSchema } from '../../src/lib/dashboardSchemas'

describe('dashboardSchemas', () => {
  test('validates profile data', () => {
    expect(() =>
      profileSchema.parse({
        displayName: 'SSR Client',
        email: 'client@example.com',
        phone: '+919876543210',
      })
    ).not.toThrow()
  })

  test('requires matching password change fields', () => {
    expect(() =>
      passwordChangeSchema.parse({
        currentPassword: 'OldPassword1',
        newPassword: 'NewPassword1',
        confirmPassword: 'Mismatch',
      })
    ).toThrow('Passwords do not match')
  })

  test('normalizes profile phone input', () => {
    expect(normalizeProfileInput({ phone: '9876543210' }).phone).toBe('+919876543210')
  })
})
