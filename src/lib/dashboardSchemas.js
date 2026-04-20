import { z } from 'zod'
import { normalizeIndianPhone } from './authSchemas'

export const profileSchema = z.object({
  displayName: z.string().trim().min(3, 'Display name must be at least 3 characters'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z
    .string()
    .trim()
    .regex(/^\+91[6-9]\d{9}$/, 'Use a valid Indian mobile number, e.g. +919876543210'),
})

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Add at least one uppercase letter')
      .regex(/[a-z]/, 'Add at least one lowercase letter')
      .regex(/\d/, 'Add at least one number'),
    confirmPassword: z.string().min(1, 'Confirm your new password'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export function normalizeProfileInput(values) {
  return {
    ...values,
    phone: normalizeIndianPhone(values.phone),
  }
}
