import { z } from 'zod'

const emailField = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .email('Enter a valid email address')

const passwordField = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Add at least one uppercase letter')
  .regex(/[a-z]/, 'Add at least one lowercase letter')
  .regex(/\d/, 'Add at least one number')

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(3, 'Enter your full name'),
    email: emailField,
    phone: z
      .string()
      .trim()
      .regex(/^\+91[6-9]\d{9}$/, 'Use a valid Indian mobile number, e.g. +919876543210'),
    password: passwordField,
    confirmPassword: z.string().min(1, 'Confirm your password'),
    termsAccepted: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms and conditions' }),
    }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export const forgotPasswordRequestSchema = z.object({
  email: emailField,
})

export const forgotPasswordResetSchema = z
  .object({
    otp: z
      .string()
      .trim()
      .regex(/^\d{6}$/, 'Enter the 6-digit OTP'),
    newPassword: passwordField,
    confirmPassword: z.string().min(1, 'Confirm your new password'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export function getPasswordStrength(password = '') {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]

  const score = checks.filter(Boolean).length

  if (score <= 2) return { score, label: 'Weak' }
  if (score === 3 || score === 4) return { score, label: 'Good' }
  return { score, label: 'Strong' }
}

export function normalizeIndianPhone(value = '') {
  const digits = value.replace(/\D/g, '')

  if (!digits) return '+91'

  let localDigits = digits
  if (localDigits.startsWith('91')) {
    localDigits = localDigits.slice(2)
  }

  return `+91${localDigits.slice(0, 10)}`
}
