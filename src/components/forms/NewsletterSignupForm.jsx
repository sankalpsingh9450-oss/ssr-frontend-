import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { SERVICES } from '../../constants'
import { formApi } from '../../lib/formApi'
import { newsletterSchema } from '../../lib/formSchemas'
import { FieldError } from './FormUi'

export default function NewsletterSignupForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(newsletterSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      name: '',
      preferences: [],
    },
  })

  const onSubmit = async (values) => {
    setServerError('')
    try {
      const response = await formApi.submitNewsletterSignup(values)
      setIsSubmitted(true)
      toast.success(response.message || 'Subscribed successfully.')
    } catch (error) {
      const message = error.message || 'We could not complete the signup right now.'
      setServerError(message)
      toast.error(message)
    }
  }

  if (isSubmitted) {
    return (
      <div className="rounded-[8px] border border-[rgba(255,255,255,0.2)] p-4">
        <p className="text-sm font-semibold text-white">You’re in.</p>
        <p className="mt-2 text-sm leading-6 text-white/80">Thanks for subscribing. We’ll send service updates and useful project insights to your inbox.</p>
      </div>
    )
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label htmlFor="newsletter-email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[rgba(214,184,112,.86)]">
          Newsletter Signup
        </label>
        <input
          id="newsletter-email"
          type="email"
          {...register('email')}
          className={`w-full min-h-[44px] rounded-[4px] border bg-transparent px-3 py-2 text-sm text-white outline-none transition placeholder:text-white/60 ${errors.email ? 'border-[var(--color-error)]' : 'border-white/30 focus:border-[#d4af37]'}`}
          placeholder="Enter your email"
          aria-invalid={Boolean(errors.email)}
        />
        <FieldError message={errors.email?.message} id="newsletter-email-error" />
      </div>

      <div>
        <input
          id="newsletter-name"
          type="text"
          {...register('name')}
          className="w-full min-h-[44px] rounded-[4px] border border-white/30 bg-transparent px-3 py-2 text-sm text-white outline-none transition placeholder:text-white/60 focus:border-[#d4af37]"
          placeholder="Name (optional)"
        />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Interested In</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {SERVICES.slice(0, 4).map((service) => (
            <label key={service.id} className="flex min-h-[44px] items-center gap-2 rounded-[4px] border border-white/20 px-3 text-xs text-white/80">
              <input type="checkbox" value={service.title} {...register('preferences')} className="h-3.5 w-3.5 accent-[#d4af37]" />
              <span>{service.title}</span>
            </label>
          ))}
        </div>
      </div>

      {serverError ? <p className="rounded-[4px] border border-[var(--color-error)] px-3 py-2 text-xs text-red-200">{serverError}</p> : null}

      <button type="submit" className="ui-btn ui-btn-primary w-full" disabled={isSubmitting || !isValid}>
        {isSubmitting ? 'Joining...' : 'Subscribe'}
      </button>
    </form>
  )
}
