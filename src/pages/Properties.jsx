import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import properties from '../properties'
import { SITE } from '../constants'
import { FieldError, getInputClass } from '../components/forms/FormUi'
import { propertyLeadSchema } from '../lib/formSchemas'

export default function Properties() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(propertyLeadSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      budget: '',
    },
  })

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 400))
    toast.success('We will contact you shortly')
    reset()
  }

  return (
    <section className="min-h-screen bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Available Properties
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
            Explore a curated selection of residential, commercial, and investment-ready properties across Delhi NCR.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => {
            const encodedMessage = encodeURIComponent(`Hi, I am interested in this property:

${property.title}
Price: ${property.price}
Location: ${property.location}

Please share more details.`)

            return (
              <article
                key={property.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <img
                  src={property.imageUrl}
                  alt={property.title}
                  className="h-56 w-full object-cover"
                />

                <div className="space-y-4 p-5">
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-[#1a2540]">{property.price}</p>
                    <h2 className="text-xl font-semibold text-slate-900">{property.title}</h2>
                    <p className="text-sm font-medium text-slate-500">{property.location}</p>
                    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
                      {property.type}
                    </span>
                  </div>

                  <p className="text-sm leading-6 text-slate-600">{property.description}</p>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <a
                      href={`tel:${SITE.phoneRaw}`}
                      className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md bg-[#1a2540] px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#24345b]"
                    >
                      Call
                    </a>
                    <a
                      href={`https://wa.me/918796138550?text=${encodedMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md border border-[#1a2540] px-4 py-3 text-sm font-semibold text-[#1a2540] transition-colors duration-200 hover:bg-[#1a2540] hover:text-white"
                    >
                      Get Details
                    </a>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-14 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Interested in a property?</h2>
            <p className="mt-2 text-sm text-slate-600">
              Share your details and budget range. Our team will contact you with suitable options.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="property-lead-name" className="mb-2 block text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                id="property-lead-name"
                {...register('name')}
                className={getInputClass(errors.name)}
                placeholder="Your name"
                aria-invalid={Boolean(errors.name)}
              />
              <FieldError message={errors.name?.message} id="property-lead-name-error" />
            </div>

            <div>
              <label htmlFor="property-lead-phone" className="mb-2 block text-sm font-medium text-slate-700">
                Phone
              </label>
              <input
                id="property-lead-phone"
                {...register('phone')}
                className={getInputClass(errors.phone)}
                placeholder="10 digit phone number"
                aria-invalid={Boolean(errors.phone)}
              />
              <FieldError message={errors.phone?.message} id="property-lead-phone-error" />
            </div>

            <div>
              <label htmlFor="property-lead-budget" className="mb-2 block text-sm font-medium text-slate-700">
                Budget
              </label>
              <select
                id="property-lead-budget"
                {...register('budget')}
                className={getInputClass(errors.budget)}
                aria-invalid={Boolean(errors.budget)}
              >
                <option value="">Select budget</option>
                <option value="50L-1Cr">50L-1Cr</option>
                <option value="1Cr-3Cr">1Cr-3Cr</option>
                <option value="3Cr-5Cr">3Cr-5Cr</option>
              </select>
              <FieldError message={errors.budget?.message} id="property-lead-budget-error" />
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#1a2540] px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#24345b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
