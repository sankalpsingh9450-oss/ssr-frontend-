import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { authApi } from '../lib/authApi'
import { forgotPasswordRequestSchema, forgotPasswordResetSchema } from '../lib/authSchemas'
import AuthShell from '../components/auth/AuthShell'

const inputClassName =
  'mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20'

export default function ForgotPassword() {
  const [step, setStep] = useState('request')
  const [email, setEmail] = useState('')
  const [resendCountdown, setResendCountdown] = useState(30)

  const requestForm = useForm({
    resolver: zodResolver(forgotPasswordRequestSchema),
    mode: 'onChange',
    defaultValues: { email: '' },
  })

  const resetForm = useForm({
    resolver: zodResolver(forgotPasswordResetSchema),
    mode: 'onChange',
    defaultValues: {
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    if (step !== 'verify' || resendCountdown <= 0) return undefined

    const timer = window.setTimeout(() => {
      setResendCountdown((current) => current - 1)
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [step, resendCountdown])

  const sendOtp = async (values) => {
    try {
      const response = await authApi.sendOtp(values)
      setEmail(values.email)
      setStep('verify')
      setResendCountdown(30)
      toast.success(response?.message || 'OTP sent to your email.')
    } catch (error) {
      toast.error(error.message || 'Unable to send OTP right now.')
    }
  }

  const resendOtp = async () => {
    try {
      const response = await authApi.resendOtp({ email })
      setResendCountdown(30)
      toast.success(response?.message || 'OTP resent successfully.')
    } catch (error) {
      toast.error(error.message || 'Unable to resend OTP right now.')
    }
  }

  const resetPassword = async (values) => {
    try {
      const response = await authApi.resetPassword({ email, ...values })
      setStep('success')
      toast.success(response?.message || 'Password reset successfully.')
    } catch (error) {
      toast.error(error.message || 'Unable to reset the password right now.')
    }
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Recover access securely with email OTP verification and a fresh password setup."
      footer={(
        <p>
          Remembered your password?{' '}
          <Link to="/login" className="font-semibold text-[#d4af37] transition hover:text-[#f1cf6f]">
            Back to sign in
          </Link>
        </p>
      )}
    >
      {step === 'request' ? (
        <form className="space-y-5" onSubmit={requestForm.handleSubmit(sendOtp)} noValidate>
          <div>
            <label htmlFor="forgot-email" className="text-sm font-medium text-white/80">Email address</label>
            <input
              id="forgot-email"
              type="email"
              autoComplete="email"
              className={inputClassName}
              placeholder="you@ssrgroupcivil.in"
              {...requestForm.register('email')}
            />
            {requestForm.formState.errors.email ? (
              <p className="mt-2 text-sm text-red-300">{requestForm.formState.errors.email.message}</p>
            ) : (
              <p className="mt-2 text-xs text-white/45">We&apos;ll send a 6-digit OTP to this address.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!requestForm.formState.isValid || requestForm.formState.isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-[#d4af37] px-4 py-3 text-sm font-bold text-[#1a2540] transition hover:bg-[#e4c25b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {requestForm.formState.isSubmitting ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      ) : null}

      {step === 'verify' ? (
        <form className="space-y-5" onSubmit={resetForm.handleSubmit(resetPassword)} noValidate>
          <div className="rounded-2xl border border-[#d4af37]/20 bg-[#d4af37]/8 p-4 text-sm text-white/75">
            OTP sent to <span className="font-semibold text-white">{email}</span>
          </div>

          <div>
            <label htmlFor="otp" className="text-sm font-medium text-white/80">OTP</label>
            <input
              id="otp"
              inputMode="numeric"
              maxLength={6}
              className={`${inputClassName} text-center text-lg tracking-[0.45em]`}
              placeholder="123456"
              {...resetForm.register('otp', {
                onChange: (event) => {
                  resetForm.setValue('otp', event.target.value.replace(/\D/g, '').slice(0, 6), {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                },
              })}
            />
            {resetForm.formState.errors.otp ? <p className="mt-2 text-sm text-red-300">{resetForm.formState.errors.otp.message}</p> : null}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="new-password" className="text-sm font-medium text-white/80">New password</label>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                className={inputClassName}
                placeholder="New secure password"
                {...resetForm.register('newPassword')}
              />
              {resetForm.formState.errors.newPassword ? <p className="mt-2 text-sm text-red-300">{resetForm.formState.errors.newPassword.message}</p> : null}
            </div>

            <div>
              <label htmlFor="confirm-new-password" className="text-sm font-medium text-white/80">Confirm password</label>
              <input
                id="confirm-new-password"
                type="password"
                autoComplete="new-password"
                className={inputClassName}
                placeholder="Repeat password"
                {...resetForm.register('confirmPassword')}
              />
              {resetForm.formState.errors.confirmPassword ? <p className="mt-2 text-sm text-red-300">{resetForm.formState.errors.confirmPassword.message}</p> : null}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={resendOtp}
              disabled={resendCountdown > 0}
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-white/80 transition hover:border-[#d4af37]/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {resendCountdown > 0 ? `Resend OTP in ${resendCountdown}s` : 'Resend OTP'}
            </button>

            <button
              type="submit"
              disabled={!resetForm.formState.isValid || resetForm.formState.isSubmitting}
              className="inline-flex items-center justify-center rounded-2xl bg-[#d4af37] px-5 py-3 text-sm font-bold text-[#1a2540] transition hover:bg-[#e4c25b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resetForm.formState.isSubmitting ? 'Resetting password...' : 'Reset password'}
            </button>
          </div>
        </form>
      ) : null}

      {step === 'success' ? (
        <div className="space-y-5 text-center">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-3xl text-emerald-300">
            ✓
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Password updated</h2>
            <p className="mt-2 text-sm leading-6 text-white/65">
              Your password has been reset successfully. You can now sign in with your new credentials.
            </p>
          </div>
          <Link
            to="/login"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-[#d4af37] px-4 py-3 text-sm font-bold text-[#1a2540] transition hover:bg-[#e4c25b]"
          >
            Go to sign in
          </Link>
        </div>
      ) : null}
    </AuthShell>
  )
}
