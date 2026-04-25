import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { FieldError, getInputClass } from './forms/FormUi'
import { formApi } from '../lib/formApi'
import { getConsultationLeadSchema } from '../lib/formSchemas'

export default function ServiceConsultationForm({ serviceTitle, source = 'service_detail_page', propertyId = '', showPlotSize = false, showBudget = false }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(getConsultationLeadSchema({ requirePlotSize: showPlotSize, requireBudget: showBudget })),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      service: serviceTitle,
      property_id: propertyId,
      plotSize: '',
      budget: '',
    },
  })

  const onSubmit = async (values) => {
    await formApi.submitLead({
      ...values,
      source,
    })
    toast.success('We will contact you shortly')
    reset({
      name: '',
      email: '',
      phone: '',
      service: serviceTitle,
      property_id: propertyId,
      plotSize: '',
      budget: '',
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <input type="hidden" {...register('service')} />
      <input type="hidden" {...register('property_id')} />

      <div>
        <label htmlFor="service-consult-name" className="mb-2 block text-sm font-medium text-slate-700">
          Name
        </label>
        <input
          id="service-consult-name"
          {...register('name')}
          className={getInputClass(errors.name)}
          placeholder="Your name"
          aria-invalid={Boolean(errors.name)}
        />
        <FieldError message={errors.name?.message} id="service-consult-name-error" />
      </div>

      <div>
        <label htmlFor="service-consult-email" className="mb-2 block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="service-consult-email"
          type="email"
          {...register('email')}
          className={getInputClass(errors.email)}
          placeholder="you@email.com"
          aria-invalid={Boolean(errors.email)}
        />
        <FieldError message={errors.email?.message} id="service-consult-email-error" />
      </div>

      <div>
        <label htmlFor="service-consult-phone" className="mb-2 block text-sm font-medium text-slate-700">
          Phone
        </label>
        <input
          id="service-consult-phone"
          {...register('phone')}
          className={getInputClass(errors.phone)}
          placeholder="+91 9876543210"
          aria-invalid={Boolean(errors.phone)}
        />
        <FieldError message={errors.phone?.message} id="service-consult-phone-error" />
      </div>

      {showPlotSize ? (
        <div>
          <label htmlFor="service-consult-plotSize" className="mb-2 block text-sm font-medium text-slate-700">
            Plot Size / Site Area
          </label>
          <input
            id="service-consult-plotSize"
            {...register('plotSize')}
            className={getInputClass(errors.plotSize)}
            placeholder="e.g. 1800 sq ft"
            aria-invalid={Boolean(errors.plotSize)}
          />
          <FieldError message={errors.plotSize?.message} id="service-consult-plotSize-error" />
        </div>
      ) : null}

      {showBudget ? (
        <div>
          <label htmlFor="service-consult-budget" className="mb-2 block text-sm font-medium text-slate-700">
            Budget
          </label>
          <input
            id="service-consult-budget"
            {...register('budget')}
            className={getInputClass(errors.budget)}
            placeholder="e.g. ₹1Cr - ₹3Cr"
            aria-invalid={Boolean(errors.budget)}
          />
          <FieldError message={errors.budget?.message} id="service-consult-budget-error" />
        </div>
      ) : null}

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="ui-btn ui-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Submitting...' : 'Request Consultation'}
        </button>
      </div>
    </form>
  )
}
