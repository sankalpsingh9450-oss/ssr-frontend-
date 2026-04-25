import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { FieldError, getInputClass } from './forms/FormUi'
import { formApi } from '../lib/formApi'
import { constructionCalculatorLeadSchema } from '../lib/formSchemas'

const FINISH_OPTIONS = [
  { value: 'basic', label: 'Basic', rate: 1800 },
  { value: 'premium', label: 'Premium', rate: 2400 },
  { value: 'luxury', label: 'Luxury', rate: 3200 },
]

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function ConstructionCostCalculator({ mode = 'full' }) {
  const [plotSize, setPlotSize] = useState('1200')
  const [floors, setFloors] = useState('2')
  const [finishQuality, setFinishQuality] = useState('premium')
  const [showLeadForm, setShowLeadForm] = useState(false)

  const selectedFinish = FINISH_OPTIONS.find((item) => item.value === finishQuality) || FINISH_OPTIONS[1]
  const numericPlotSize = Number(plotSize) || 0
  const numericFloors = Number(floors) || 0
  const estimatedBase = numericPlotSize * numericFloors * selectedFinish.rate
  const estimatedLow = Math.round(estimatedBase * 0.92)
  const estimatedHigh = Math.round(estimatedBase * 1.12)
  const estimatedRange = `${formatCurrency(estimatedLow)} - ${formatCurrency(estimatedHigh)}`

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(constructionCalculatorLeadSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      email: '',
    },
  })

  const onSubmit = async (values) => {
    await formApi.submitLead({
      ...values,
      source: mode === 'compact' ? 'homepage_calculator' : 'residential_service_calculator',
      service: 'Residential Construction',
      plotSize,
      floors,
      finishQuality,
      estimatedRange,
    })
    toast.success('We will contact you shortly')
    reset()
    setShowLeadForm(false)
  }

  const calculatorBody = useMemo(
    () => (
      <>
        <div className={`grid gap-4 ${mode === 'compact' ? 'lg:grid-cols-3' : 'md:grid-cols-3'}`}>
          <div>
            <label htmlFor={`calc-plot-size-${mode}`} className="mb-2 block text-sm font-medium text-slate-700">
              Plot Size (sq ft)
            </label>
            <input
              id={`calc-plot-size-${mode}`}
              type="number"
              min="100"
              step="50"
              value={plotSize}
              onChange={(event) => setPlotSize(event.target.value)}
              className={getInputClass(false)}
              placeholder="e.g. 1200"
            />
          </div>

          <div>
            <label htmlFor={`calc-floors-${mode}`} className="mb-2 block text-sm font-medium text-slate-700">
              Floors
            </label>
            <input
              id={`calc-floors-${mode}`}
              type="number"
              min="1"
              step="1"
              value={floors}
              onChange={(event) => setFloors(event.target.value)}
              className={getInputClass(false)}
              placeholder="e.g. 2"
            />
          </div>

          <div>
            <label htmlFor={`calc-finish-${mode}`} className="mb-2 block text-sm font-medium text-slate-700">
              Finish Quality
            </label>
            <select
              id={`calc-finish-${mode}`}
              value={finishQuality}
              onChange={(event) => setFinishQuality(event.target.value)}
              className={getInputClass(false)}
            >
              {FINISH_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-[#d4af37]/25 bg-slate-50 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d4af37]">Estimated Cost Range</p>
          <h3 className="mt-3 text-3xl font-bold text-[#1a2540]">{estimatedRange}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            This is an indicative estimate based on built-up area, floors, and finish quality. Final cost depends on structure, design complexity, material brand choices, and site conditions.
          </p>
        </div>
      </>
    ),
    [estimatedRange, finishQuality, floors, mode, plotSize]
  )

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d4af37]">Construction Cost Estimator</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          {mode === 'compact' ? 'Estimate your home construction budget' : 'Calculate your residential construction estimate'}
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Get a quick range for planning your project before moving to a detailed BOQ and consultation.
        </p>
      </div>

      <div className="mt-6">{calculatorBody}</div>

      {showLeadForm ? (
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-xl font-semibold text-slate-900">Get Detailed Quote</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Share your details and we will contact you with a more tailored estimate for your project.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label htmlFor={`calc-lead-name-${mode}`} className="mb-2 block text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                id={`calc-lead-name-${mode}`}
                {...register('name')}
                className={getInputClass(errors.name)}
                placeholder="Your name"
                aria-invalid={Boolean(errors.name)}
              />
              <FieldError message={errors.name?.message} id={`calc-lead-name-${mode}-error`} />
            </div>

            <div>
              <label htmlFor={`calc-lead-phone-${mode}`} className="mb-2 block text-sm font-medium text-slate-700">
                Phone
              </label>
              <input
                id={`calc-lead-phone-${mode}`}
                {...register('phone')}
                className={getInputClass(errors.phone)}
                placeholder="+91 9876543210"
                aria-invalid={Boolean(errors.phone)}
              />
              <FieldError message={errors.phone?.message} id={`calc-lead-phone-${mode}-error`} />
            </div>

            <div>
              <label htmlFor={`calc-lead-email-${mode}`} className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id={`calc-lead-email-${mode}`}
                type="email"
                {...register('email')}
                className={getInputClass(errors.email)}
                placeholder="you@email.com"
                aria-invalid={Boolean(errors.email)}
              />
              <FieldError message={errors.email?.message} id={`calc-lead-email-${mode}-error`} />
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="ui-btn ui-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Submitting...' : 'Request Detailed Quote'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="mt-6">
          <button type="button" onClick={() => setShowLeadForm(true)} className="ui-btn ui-btn-primary">
            Get Detailed Quote
          </button>
        </div>
      )}
    </div>
  )
}
