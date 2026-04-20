import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { CONTACT_SUBJECTS } from '../../constants'
import { clearDraft, loadDraft, saveDraft } from '../../lib/formDrafts'
import { formApi } from '../../lib/formApi'
import { contactFormSchema } from '../../lib/formSchemas'
import { FieldError, FormSuccessState, getInputClass } from './FormUi'

const DRAFT_KEY = 'contact-inquiry'
const DEFAULT_VALUES = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  preferredContactMethod: 'Phone',
}

export default function ContactInquiryForm() {
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
    resolver: zodResolver(contactFormSchema),
    mode: 'onChange',
    defaultValues: draftDefaults,
  })

  const message = watch('message') || ''

  useEffect(() => {
    const subscription = watch((values) => saveDraft(DRAFT_KEY, values))
    return () => subscription.unsubscribe()
  }, [watch])

  const onSubmit = async (values) => {
    setServerError('')

    try {
      const response = await formApi.submitContactInquiry(values)
      setIsSubmitted(true)
      clearDraft(DRAFT_KEY)
      reset(DEFAULT_VALUES)
      toast.success(response.message || 'Message sent successfully.')
    } catch (error) {
      const messageText = error.message || 'We could not send your message right now.'
      setServerError(messageText)
      toast.error(messageText)
    }
  }

  if (isSubmitted) {
    return (
      <FormSuccessState
        title="Message sent"
        message="Thank you for reaching out. Your enquiry is now inside the live lead flow and the team will respond using your preferred contact method."
        actionLabel="Send Another"
        onAction={() => setIsSubmitted(false)}
      />
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="contact-name">Full Name *</label>
          <input id="contact-name" {...register('name')} className={getInputClass(errors.name)} placeholder="Your full name" aria-invalid={Boolean(errors.name)} />
          <FieldError message={errors.name?.message} id="contact-name-error" />
        </div>
        <div className="form-group">
          <label htmlFor="contact-phone">Phone *</label>
          <input id="contact-phone" {...register('phone')} className={getInputClass(errors.phone)} placeholder="+91 9876543210" aria-invalid={Boolean(errors.phone)} />
          <FieldError message={errors.phone?.message} id="contact-phone-error" />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="contact-email">Email *</label>
        <input id="contact-email" type="email" {...register('email')} className={getInputClass(errors.email)} placeholder="you@email.com" aria-invalid={Boolean(errors.email)} />
        <FieldError message={errors.email?.message} id="contact-email-error" />
      </div>

      <div className="form-group">
        <label htmlFor="contact-subject">Subject *</label>
        <select id="contact-subject" {...register('subject')} className={getInputClass(errors.subject)} aria-invalid={Boolean(errors.subject)}>
          <option value="">Select subject</option>
          {CONTACT_SUBJECTS.map((subject) => <option key={subject}>{subject}</option>)}
        </select>
        <FieldError message={errors.subject?.message} id="contact-subject-error" />
      </div>

      <div className="form-group">
        <label htmlFor="contact-message">Message *</label>
        <textarea
          id="contact-message"
          {...register('message')}
          rows={5}
          className={getInputClass(errors.message)}
          placeholder="Tell us how we can help..."
          aria-invalid={Boolean(errors.message)}
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <FieldError message={errors.message?.message} id="contact-message-error" />
          <span className="field-hint">{message.length}/1000</span>
        </div>
      </div>

      <div className="form-group">
        <span className="field-legend">Preferred Contact Method *</span>
        <div className="field-choice-grid mt-2">
          {['Phone', 'Email', 'WhatsApp'].map((option) => (
            <label key={option} className="field-choice">
              <input type="radio" value={option} {...register('preferredContactMethod')} />
              <span>{option}</span>
            </label>
          ))}
        </div>
        <FieldError message={errors.preferredContactMethod?.message} id="contact-preferred-contact-error" />
      </div>

      {serverError ? <p className="mb-4 rounded-[4px] border border-[var(--color-error)] bg-red-50 px-4 py-3 text-sm text-[var(--color-error)]">{serverError}</p> : null}

      <button className="ui-btn ui-btn-primary w-full" type="submit" disabled={isSubmitting || !isValid}>
        {isSubmitting ? 'Sending...' : 'Send Message →'}
      </button>
    </form>
  )
}
