import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { authApi } from '../lib/authApi'
import { getPasswordStrength, normalizeIndianPhone, registerSchema } from '../lib/authSchemas'
import { setSession } from '../lib/session'
import AuthShell from '../components/auth/AuthShell'
import PasswordStrengthMeter from '../components/auth/PasswordStrengthMeter'

const inputClassName =
  'mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20'

export default function Register() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      phone: '+91',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
  })

  const password = watch('password')
  const phone = watch('phone')
  const strength = getPasswordStrength(password)

  const handleGoogleAuth = () => {
    const googleUrl = authApi.getGoogleAuthUrl()

    if (!googleUrl) {
      toast.error('Google sign-up endpoint is not configured yet.')
      return
    }

    window.location.assign(googleUrl)
  }

  const onSubmit = async (values) => {
    try {
      const response = await authApi.register(values)
      setSession({
        email: response?.user?.email || values.email,
        name: response?.user?.name || values.fullName,
      })
      toast.success(response?.message || 'Account created successfully.')
      navigate('/profile')
    } catch (error) {
      toast.error(error.message || 'Unable to create your account right now.')
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Register for secure project access, quotation tracking, and priority client updates from SSR Group Civil."
      footer={(
        <p>
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-[#d4af37] transition hover:text-[#f1cf6f]">
            Sign in
          </Link>
        </p>
      )}
    >
      <button
        type="button"
        onClick={handleGoogleAuth}
        className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09A6.96 6.96 0 0 1 5.49 12c0-.73.13-1.43.35-2.09V7.07H2.18A11.92 11.92 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l4.66-2.84z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" fill="#EA4335" />
        </svg>
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/35">
        <span className="h-px flex-1 bg-white/10" />
        Or create account with email
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label htmlFor="register-name" className="text-sm font-medium text-white/80">Full name</label>
          <input
            id="register-name"
            autoComplete="name"
            className={inputClassName}
            placeholder="Sankalp Singh Rajput"
            {...register('fullName')}
          />
          {errors.fullName ? <p className="mt-2 text-sm text-red-300">{errors.fullName.message}</p> : null}
        </div>

        <div>
          <label htmlFor="register-email" className="text-sm font-medium text-white/80">Email address</label>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            className={inputClassName}
            placeholder="you@ssrgroupcivil.in"
            {...register('email')}
          />
          {errors.email ? <p className="mt-2 text-sm text-red-300">{errors.email.message}</p> : null}
        </div>

        <div>
          <label htmlFor="register-phone" className="text-sm font-medium text-white/80">Phone number</label>
          <input
            id="register-phone"
            type="tel"
            autoComplete="tel"
            inputMode="numeric"
            className={inputClassName}
            placeholder="+919876543210"
            {...register('phone', {
              onChange: (event) => {
                setValue('phone', normalizeIndianPhone(event.target.value), {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              },
            })}
          />
          {errors.phone ? (
            <p className="mt-2 text-sm text-red-300">{errors.phone.message}</p>
          ) : (
            <p className="mt-2 text-xs text-white/45">{phone?.startsWith('+91') ? 'Indian format enabled with +91 country code.' : 'Use +91 followed by 10 digits.'}</p>
          )}
        </div>

        <div>
          <label htmlFor="register-password" className="text-sm font-medium text-white/80">Password</label>
          <input
            id="register-password"
            type="password"
            autoComplete="new-password"
            className={inputClassName}
            placeholder="Create a strong password"
            {...register('password')}
          />
          {errors.password ? <p className="mt-2 text-sm text-red-300">{errors.password.message}</p> : null}
          <PasswordStrengthMeter password={password} strength={strength} />
        </div>

        <div>
          <label htmlFor="register-confirm-password" className="text-sm font-medium text-white/80">Confirm password</label>
          <input
            id="register-confirm-password"
            type="password"
            autoComplete="new-password"
            className={inputClassName}
            placeholder="Re-enter your password"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword ? <p className="mt-2 text-sm text-red-300">{errors.confirmPassword.message}</p> : null}
        </div>

        <div>
          <label className="inline-flex items-start gap-3 text-sm text-white/70">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent text-[#d4af37] focus:ring-[#d4af37]/30"
              {...register('termsAccepted')}
            />
            <span>
              I agree to the{' '}
              <a href="/terms" className="font-semibold text-[#d4af37] hover:text-[#f1cf6f]">
                terms &amp; conditions
              </a>{' '}
              and understand secure access is protected with HTTPS and backend rate limiting.
            </span>
          </label>
          {errors.termsAccepted ? <p className="mt-2 text-sm text-red-300">{errors.termsAccepted.message}</p> : null}
        </div>

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-[#d4af37] px-4 py-3 text-sm font-bold text-[#1a2540] transition hover:bg-[#e4c25b] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthShell>
  )
}
