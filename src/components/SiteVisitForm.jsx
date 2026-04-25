import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { FieldError, getInputClass } from './forms/FormUi'
import { formApi } from '../lib/formApi'
import { siteVisitLeadSchema } from '../lib/formSchemas'

export default function SiteVisitForm({ property }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(siteVisitLeadSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      preferredVisitDate: '',
      property_id: String(property.id),
      property_title: property.title,
    },
  })

  const onSubmit = async (values) => {
    await formApi.submitLead({
      ...values,
      source: 'property_detail_page',
    })
    toast.success('Site visit request received')
    reset({
      name: '',
      phone: '',
      email: '',
      preferredVisitDate: '',
      property_id: String(property.id),
      property_title: property.title,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <input type="hidden" {...register('property_id')} />
      <input type="hidden" {...register('property_title')} />

      <div>
        <label htmlFor="site-visit-name" className="mb-2 block text-sm font-medium text-slate-700">
          Name
        </label>
        <input
          id="site-visit-name"
          {...register('name')}
          className={getInputClass(errors.name)}
          placeholder="Your name"
          aria-invalid={Boolean(errors.name)}
        />
        <FieldError message={errors.name?.message} id="site-visit-name-error" />
      </div>

      <div>
        <label htmlFor="site-visit-phone" className="mb-2 block text-sm font-medium text-slate-700">
          Phone
        </label>
        <input
          id="site-visit-phone"
          {...register('phone')}
          className={getInputClass(errors.phone)}
          placeholder="+91 9876543210"
          aria-invalid={Boolean(errors.phone)}
        />
        <FieldError message={errors.phone?.message} id="site-visit-phone-error" />
      </div>

      <div>
        <label htmlFor="site-visit-email" className="mb-2 block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="site-visit-email"
          type="email"
          {...register('email')}
          className={getInputClass(errors.email)}
          placeholder="you@email.com"
          aria-invalid={Boolean(errors.email)}
        />
        <FieldError message={errors.email?.message} id="site-visit-email-error" />
      </div>

      <div>
        <label htmlFor="site-visit-date" className="mb-2 block text-sm font-medium text-slate-700">
          Preferred Visit Date
        </label>
        <input
          id="site-visit-date"
          type="date"
          {...register('preferredVisitDate')}
          className={getInputClass(errors.preferredVisitDate)}
          aria-invalid={Boolean(errors.preferredVisitDate)}
        />
        <FieldError message={errors.preferredVisitDate?.message} id="site-visit-date-error" />
      </div>

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="ui-btn ui-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Submitting...' : 'Book Site Visit'}
        </button>
      </div>
    </form>
  )
}
