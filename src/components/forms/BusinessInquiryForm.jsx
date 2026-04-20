import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { clearDraft, loadDraft, saveDraft } from '../../lib/formDrafts'
import { formApi } from '../../lib/formApi'
import { businessInquirySchema, getBusinessEmailHint } from '../../lib/formSchemas'
import { FieldError, FieldHint, FormSuccessState, getInputClass } from './FormUi'

const DRAFT_KEY = 'business-inquiry'
const DEFAULT_VALUES = {
  fullName: '',
  email: '',
  companyName: '',
  phone: '',
  message: '',
}

export default function BusinessInquiryForm() {
  const [serverError, setServerError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const draftDefaults = useMemo(() => loadDraft(DRAFT_KEY, DEFAULT_VALUES), [])

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(businessInquirySchema),
    mode: 'onChange',
    defaultValues: draftDefaults,
  })

  const email = watch('email')
  const companyName = watch('companyName')

  useEffect(() => {
    const subscription = watch((values) => saveDraft(DRAFT_KEY, values))
    return () => subscription.unsubscribe()
  }, [watch])

  const onSubmit = async (values) => {
    setServerError('')
    try {
      const response = await formApi.submitBusinessInquiry({
        name: values.fullName,
        email: values.email,
        phone: values.phone,
        business_name: values.companyName,
        category: 'Business Enquiry',
        message: values.message,
      })
      setIsSubmitted(true)
      clearDraft(DRAFT_KEY)
      reset(DEFAULT_VALUES)
      toast.success(response.message || 'Business enquiry submitted successfully.')
    } catch (error) {
      const message = error.message || 'We could not submit your business enquiry right now.'
      setServerError(message)
      toast.error(message)
    }
  }

  if (isSubmitted) {
    return (
      <FormSuccessState
        title="Business enquiry received"
        message="Thank you. Your partner or company enquiry is with the SSR Group team now, and they’ll review the details before following up."
        actionLabel="Send Another"
        onAction={() => setIsSubmitted(false)}
      />
    )
  }

  return (
    <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-group">
        <label htmlFor="business-full-name">Full Name *</label>
        <input id="business-full-name" {...register('fullName')} className={getInputClass(errors.fullName)} placeholder="Your full name" />
        <FieldError message={errors.fullName?.message} id="business-full-name-error" />
      </div>
      <div className="form-group">
        <label htmlFor="business-phone">Phone *</label>
        <input id="business-phone" {...register('phone')} className={getInputClass(errors.phone)} placeholder="+91 9876543210" />
        <FieldError message={errors.phone?.message} id="business-phone-error" />
      </div>
      <div className="form-group">
        <label htmlFor="business-email">Email *</label>
        <input id="business-email" type="email" {...register('email')} className={getInputClass(errors.email)} placeholder="you@company.com" />
        <FieldError message={errors.email?.message} id="business-email-error" />
        <FieldHint>{getBusinessEmailHint(email, companyName)}</FieldHint>
      </div>
      <div className="form-group">
        <label htmlFor="business-company">Company Name</label>
        <input id="business-company" {...register('companyName')} className={getInputClass(errors.companyName)} placeholder="Company name (optional)" />
      </div>
      <div className="form-group md:col-span-2">
        <label htmlFor="business-message">Message *</label>
        <textarea id="business-message" {...register('message')} rows={4} className={getInputClass(errors.message)} placeholder="Tell us about your business enquiry, partnership, or vendor proposal..." />
        <FieldError message={errors.message?.message} id="business-message-error" />
      </div>
      {serverError ? <p className="md:col-span-2 rounded-[4px] border border-[var(--color-error)] bg-red-50 px-4 py-3 text-sm text-[var(--color-error)]">{serverError}</p> : null}
      <div className="md:col-span-2">
        <button className="ui-btn ui-btn-primary" type="submit" disabled={isSubmitting || !isValid}>
          {isSubmitting ? 'Sending...' : 'Submit Business Enquiry'}
        </button>
      </div>
    </form>
  )
}
