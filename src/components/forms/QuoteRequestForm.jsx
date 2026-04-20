import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { SERVICES } from '../../constants'
import { clearDraft, loadDraft, saveDraft } from '../../lib/formDrafts'
import { formApi } from '../../lib/formApi'
import { mapFilesToMetadata, quoteRequestSchema } from '../../lib/formSchemas'
import { FieldError, FieldHint, FormSuccessState, getInputClass } from './FormUi'

const DRAFT_KEY = 'quote-request'
const DEFAULT_VALUES = {
  fullName: '',
  email: '',
  phone: '',
  serviceType: '',
  projectDescription: '',
  budgetRange: '',
  timeline: '',
  attachments: [],
  termsAccepted: false,
}

const BUDGET_OPTIONS = ['Below ₹10L', '₹10L - ₹25L', '₹25L - ₹50L', '₹50L - ₹1Cr', 'Above ₹1Cr']
const TIMELINE_OPTIONS = ['Immediate', 'Within 1 month', 'Within 3 months', 'Just exploring']

export default function QuoteRequestForm({ onSubmitted, onCloseLabel = 'Done' }) {
  const [serverError, setServerError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const draftDefaults = useMemo(() => loadDraft(DRAFT_KEY, DEFAULT_VALUES), [])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(quoteRequestSchema),
    mode: 'onChange',
    defaultValues: draftDefaults,
  })

  const attachments = watch('attachments')
  const projectDescription = watch('projectDescription') || ''

  useEffect(() => {
    const subscription = watch((values) => {
      const { attachments: ignoredAttachments, ...serializableValues } = values
      saveDraft(DRAFT_KEY, serializableValues)
    })
    return () => subscription.unsubscribe()
  }, [watch])

  const onSubmit = async (values) => {
    setServerError('')

    try {
      const response = await formApi.submitQuoteRequest({
        name: values.fullName,
        email: values.email,
        phone: values.phone,
        request_type: 'Free Quotation',
        project_type: values.serviceType,
        details: values.projectDescription,
        budget_range: values.budgetRange || null,
        timeline: values.timeline,
        attachments: values.attachments,
        attachment_names: values.attachments.map((file) => file.name),
      })

      setIsSubmitted(true)
      clearDraft(DRAFT_KEY)
      reset(DEFAULT_VALUES)
      toast.success(response.message || 'Quote request submitted successfully.')
    } catch (error) {
      const message = error.message || 'We could not submit your quote request right now.'
      setServerError(message)
      toast.error(message)
    }
  }

  if (isSubmitted) {
    return (
      <FormSuccessState
        title="Quote request received"
        message="Thank you. Your quotation request is in the queue, and a confirmation email has been prepared for your inbox. Our team will follow up shortly."
        actionLabel={onCloseLabel}
        onAction={() => {
          setIsSubmitted(false)
          onSubmitted?.()
        }}
      />
    )
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="quote-full-name">Full Name *</label>
          <input id="quote-full-name" {...register('fullName')} className={getInputClass(errors.fullName)} placeholder="Your full name" aria-invalid={Boolean(errors.fullName)} />
          <FieldError message={errors.fullName?.message} id="quote-full-name-error" />
        </div>
        <div className="form-group">
          <label htmlFor="quote-phone">Phone *</label>
          <input id="quote-phone" {...register('phone')} className={getInputClass(errors.phone)} placeholder="+91 9876543210" aria-invalid={Boolean(errors.phone)} />
          <FieldError message={errors.phone?.message} id="quote-phone-error" />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="quote-email">Email *</label>
        <input id="quote-email" type="email" {...register('email')} className={getInputClass(errors.email)} placeholder="you@email.com" aria-invalid={Boolean(errors.email)} />
        <FieldError message={errors.email?.message} id="quote-email-error" />
      </div>

      <div className="form-group">
        <label htmlFor="quote-service">Service Type *</label>
        <select id="quote-service" {...register('serviceType')} className={getInputClass(errors.serviceType)} aria-invalid={Boolean(errors.serviceType)}>
          <option value="">Select a service</option>
          {SERVICES.map((service) => (
            <option key={service.id} value={service.title}>
              {service.title}
            </option>
          ))}
        </select>
        <FieldError message={errors.serviceType?.message} id="quote-service-error" />
      </div>

      <div className="form-group">
        <label htmlFor="quote-description">Project Description *</label>
        <textarea
          id="quote-description"
          {...register('projectDescription')}
          rows={4}
          className={getInputClass(errors.projectDescription)}
          placeholder="Tell us about location, area, project goals, and any important site constraints..."
          aria-invalid={Boolean(errors.projectDescription)}
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <FieldError message={errors.projectDescription?.message} id="quote-description-error" />
          <span className="text-xs text-slate-500">{projectDescription.length}/500</span>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="quote-budget">Budget Range</label>
          <select id="quote-budget" {...register('budgetRange')} className={getInputClass(errors.budgetRange)}>
            <option value="">Select a range</option>
            {BUDGET_OPTIONS.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>
        <div className="form-group">
          <span className="field-legend">Timeline *</span>
          <div className="field-choice-grid mt-2">
            {TIMELINE_OPTIONS.map((option) => (
              <label key={option} className="field-choice">
                <input type="radio" value={option} {...register('timeline')} />
                <span>{option}</span>
              </label>
            ))}
          </div>
          <FieldError message={errors.timeline?.message} id="quote-timeline-error" />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="quote-attachments">Attachments</label>
        <input
          id="quote-attachments"
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
          className={getInputClass(errors.attachments)}
          onChange={(event) => {
            setValue('attachments', mapFilesToMetadata(event.target.files), {
              shouldValidate: true,
              shouldDirty: true,
            })
          }}
        />
        <FieldHint>Upload up to 5 files. Total size must stay under 10MB.</FieldHint>
        <FieldError message={errors.attachments?.message} id="quote-attachments-error" />
        {attachments?.length ? (
          <ul className="mt-3 space-y-1 text-xs text-slate-500">
            {attachments.map((file) => (
              <li key={`${file.name}-${file.size}`}>{file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB</li>
            ))}
          </ul>
        ) : null}
      </div>

      <label className="field-choice field-checkbox">
        <input type="checkbox" {...register('termsAccepted')} className="mt-0.5" />
        <span>I confirm that the project details shared here are accurate and I agree to be contacted by the SSR Group team.</span>
      </label>
      <FieldError message={errors.termsAccepted?.message} id="quote-terms-error" />

      {serverError ? <p className="rounded-[4px] border border-[var(--color-error)] bg-red-50 px-4 py-3 text-sm text-[var(--color-error)]">{serverError}</p> : null}

      <button className="ui-btn ui-btn-primary w-full" type="submit" disabled={isSubmitting || !isValid}>
        {isSubmitting ? 'Submitting...' : 'Submit — Get Free Quote ✨'}
      </button>
      <p className="popup-privacy">🔒 Your data is secure. We never share your information.</p>
    </form>
  )
}
