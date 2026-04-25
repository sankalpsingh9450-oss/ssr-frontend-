import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { clearDraft, loadDraft, saveDraft } from '../../lib/formDrafts'
import { formApi } from '../../lib/formApi'
import { contactFormSchema } from '../../lib/formSchemas'
import { FieldError, FormSuccessState, getInputClass } from './FormUi'

const DRAFT_KEY = 'contact-inquiry'
const DEFAULT_VALUES = {
  name: '',
  email: '',
  phone: '',
  intent: 'Construction',
  subject: '',
  message: '',
  preferredContactMethod: 'Phone',
  plotSize: '',
  projectStage: '',
  budget: '',
  preferredLocation: '',
  investmentGoal: '',
}

const INTENT_OPTIONS = ['Construction', 'Property', 'Investment', 'Other']
const PROJECT_STAGES = ['Planning', 'Design in Progress', 'Ready to Start', 'Already Under Construction']
const SUBJECT_BY_INTENT = {
  Construction: 'Construction Quote',
  Property: 'Property Enquiry',
  Investment: 'Investment Advisory',
  Other: 'Other',
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

  const intent = watch('intent') || 'Construction'
  const message = watch('message') || ''

  useEffect(() => {
    const subscription = watch((values) => saveDraft(DRAFT_KEY, values))
    return () => subscription.unsubscribe()
  }, [watch])

  const onSubmit = async (values) => {
    setServerError('')

    try {
      const response = await formApi.submitContactInquiry({
        ...values,
        subject: SUBJECT_BY_INTENT[values.intent] || 'Other',
      })
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
      <div className="form-group">
        <span className="field-legend">What do you need help with? *</span>
        <div className="field-choice-grid mt-2">
          {INTENT_OPTIONS.map((option) => (
            <label key={option} className="field-choice">
              <input type="radio" value={option} {...register('intent')} />
              <span>{option}</span>
            </label>
          ))}
        </div>
        <FieldError message={errors.intent?.message} id="contact-intent-error" />
      </div>

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

      {intent === 'Construction' ? (
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="contact-plot-size">Plot Size / Site Area *</label>
            <input
              id="contact-plot-size"
              {...register('plotSize')}
              className={getInputClass(errors.plotSize)}
              placeholder="e.g. 1800 sq ft"
              aria-invalid={Boolean(errors.plotSize)}
            />
            <FieldError message={errors.plotSize?.message} id="contact-plot-size-error" />
          </div>
          <div className="form-group">
            <label htmlFor="contact-project-stage">Project Stage *</label>
            <select
              id="contact-project-stage"
              {...register('projectStage')}
              className={getInputClass(errors.projectStage)}
              aria-invalid={Boolean(errors.projectStage)}
            >
              <option value="">Select stage</option>
              {PROJECT_STAGES.map((stage) => (
                <option key={stage}>{stage}</option>
              ))}
            </select>
            <FieldError message={errors.projectStage?.message} id="contact-project-stage-error" />
          </div>
        </div>
      ) : null}

      {intent === 'Property' ? (
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="contact-budget">Budget *</label>
            <input
              id="contact-budget"
              {...register('budget')}
              className={getInputClass(errors.budget)}
              placeholder="e.g. ₹50L - ₹1Cr"
              aria-invalid={Boolean(errors.budget)}
            />
            <FieldError message={errors.budget?.message} id="contact-budget-error" />
          </div>
          <div className="form-group">
            <label htmlFor="contact-preferred-location">Preferred Location *</label>
            <input
              id="contact-preferred-location"
              {...register('preferredLocation')}
              className={getInputClass(errors.preferredLocation)}
              placeholder="e.g. Greater Noida West"
              aria-invalid={Boolean(errors.preferredLocation)}
            />
            <FieldError message={errors.preferredLocation?.message} id="contact-preferred-location-error" />
          </div>
        </div>
      ) : null}

      {intent === 'Investment' ? (
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="contact-investment-budget">Budget *</label>
            <input
              id="contact-investment-budget"
              {...register('budget')}
              className={getInputClass(errors.budget)}
              placeholder="e.g. ₹1Cr - ₹3Cr"
              aria-invalid={Boolean(errors.budget)}
            />
            <FieldError message={errors.budget?.message} id="contact-investment-budget-error" />
          </div>
          <div className="form-group">
            <label htmlFor="contact-investment-goal">Investment Goal *</label>
            <input
              id="contact-investment-goal"
              {...register('investmentGoal')}
              className={getInputClass(errors.investmentGoal)}
              placeholder="e.g. Rental yield / long-term appreciation"
              aria-invalid={Boolean(errors.investmentGoal)}
            />
            <FieldError message={errors.investmentGoal?.message} id="contact-investment-goal-error" />
          </div>
        </div>
      ) : null}

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
