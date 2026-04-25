import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useScrollLock } from '../hooks'
import { formApi } from '../lib/formApi'
import { propertyLeadSchema } from '../lib/formSchemas'
import { FieldError, getInputClass } from './forms/FormUi'

const SESSION_KEY = 'ssr-properties-scroll-popup-seen'

export default function PropertiesScrollPopup() {
  const [isOpen, setIsOpen] = useState(false)
  useScrollLock(isOpen)

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

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    if (window.sessionStorage.getItem(SESSION_KEY) === 'true') return undefined

    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollableHeight <= 0) return

      const scrollDepth = window.scrollY / scrollableHeight
      if (scrollDepth >= 0.7) {
        window.sessionStorage.setItem(SESSION_KEY, 'true')
        setIsOpen(true)
        window.removeEventListener('scroll', handleScroll)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closePopup = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(SESSION_KEY, 'true')
    }
    setIsOpen(false)
  }

  const onSubmit = async (values) => {
    await formApi.submitPropertyLead({
      ...values,
      source: 'properties_page_scroll_popup',
    })
    toast.success('We will contact you shortly')
    reset()
    closePopup()
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(event) => event.target === event.currentTarget && closePopup()}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8"
          >
            <button
              type="button"
              onClick={closePopup}
              className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-md text-slate-500 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900"
              aria-label="Close popup"
            >
              <FiX className="text-xl" />
            </button>

            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d4af37]">Property Help</p>
            <h3 className="mt-3 text-3xl font-bold text-[#1a2540]">Not finding what you want?</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Share your details and budget. Our team will help shortlist better property options for you.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
              <div>
                <label htmlFor="scroll-popup-name" className="mb-2 block text-sm font-medium text-slate-700">
                  Name
                </label>
                <input
                  id="scroll-popup-name"
                  {...register('name')}
                  className={getInputClass(errors.name)}
                  placeholder="Your name"
                  aria-invalid={Boolean(errors.name)}
                />
                <FieldError message={errors.name?.message} id="scroll-popup-name-error" />
              </div>

              <div>
                <label htmlFor="scroll-popup-phone" className="mb-2 block text-sm font-medium text-slate-700">
                  Phone
                </label>
                <input
                  id="scroll-popup-phone"
                  {...register('phone')}
                  className={getInputClass(errors.phone)}
                  placeholder="10 digit phone number"
                  aria-invalid={Boolean(errors.phone)}
                />
                <FieldError message={errors.phone?.message} id="scroll-popup-phone-error" />
              </div>

              <div>
                <label htmlFor="scroll-popup-budget" className="mb-2 block text-sm font-medium text-slate-700">
                  Budget
                </label>
                <select
                  id="scroll-popup-budget"
                  {...register('budget')}
                  className={getInputClass(errors.budget)}
                  aria-invalid={Boolean(errors.budget)}
                >
                  <option value="">Select budget</option>
                  <option value="50L-1Cr">50L-1Cr</option>
                  <option value="1Cr-3Cr">1Cr-3Cr</option>
                  <option value="3Cr-5Cr">3Cr-5Cr</option>
                </select>
                <FieldError message={errors.budget?.message} id="scroll-popup-budget-error" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="ui-btn ui-btn-primary mt-2 w-full disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Submitting...' : 'Get Property Assistance'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
