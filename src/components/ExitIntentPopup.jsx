import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useScrollLock } from '../hooks'
import { formApi } from '../lib/formApi'
import { exitIntentLeadSchema } from '../lib/formSchemas'
import { FieldError, FormSuccessState, getInputClass } from './forms/FormUi'

function getDismissKey(slug) {
  return `ssr-exit-intent-dismissed:${slug}`
}

export default function ExitIntentPopup({ slug, serviceTitle }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const dismissKey = useMemo(() => getDismissKey(slug), [slug])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(exitIntentLeadSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      email: '',
    },
  })

  useScrollLock(isOpen)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    if (window.innerWidth < 1024) return undefined
    if (window.localStorage.getItem(dismissKey) === 'true') return undefined

    let hasShown = false

    const handleMouseMove = (event) => {
      if (hasShown || isOpen) return
      if (event.clientY > 40) return

      hasShown = true
      setIsOpen(true)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [dismissKey, isOpen])

  const handleClose = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(dismissKey, 'true')
    }
    setIsOpen(false)
  }

  const onSubmit = async (values) => {
    await formApi.submitLead({
      ...values,
      service: serviceTitle,
      source: 'service_exit_intent',
    })
    toast.success('We will contact you shortly')
    setIsSubmitted(true)
    reset()
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 hidden items-center justify-center bg-slate-950/55 px-4 lg:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(event) => event.target === event.currentTarget && handleClose()}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-full max-w-lg rounded-xl border border-[#d4af37]/20 bg-white p-8 shadow-2xl"
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-md text-slate-500 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900"
              aria-label="Close popup"
            >
              <FiX className="text-xl" />
            </button>

            {isSubmitted ? (
              <FormSuccessState
                title="Consultation request received"
                message={`Thanks for your interest in ${serviceTitle}. Our team will contact you shortly.`}
                actionLabel="Done"
                onAction={handleClose}
              />
            ) : (
              <>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d4af37]">Free Consultation</p>
                <h3 className="mt-3 text-3xl font-bold text-[#1a2540]">Get Your Free Consultation</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Leave your details and our team will guide you on {serviceTitle.toLowerCase()} with the right next steps.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="exit-intent-name" className="mb-2 block text-sm font-medium text-slate-700">
                      Name
                    </label>
                    <input
                      id="exit-intent-name"
                      {...register('name')}
                      className={getInputClass(errors.name)}
                      placeholder="Your name"
                      aria-invalid={Boolean(errors.name)}
                    />
                    <FieldError message={errors.name?.message} id="exit-intent-name-error" />
                  </div>

                  <div>
                    <label htmlFor="exit-intent-phone" className="mb-2 block text-sm font-medium text-slate-700">
                      Phone
                    </label>
                    <input
                      id="exit-intent-phone"
                      {...register('phone')}
                      className={getInputClass(errors.phone)}
                      placeholder="+91 9876543210"
                      aria-invalid={Boolean(errors.phone)}
                    />
                    <FieldError message={errors.phone?.message} id="exit-intent-phone-error" />
                  </div>

                  <div>
                    <label htmlFor="exit-intent-email" className="mb-2 block text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <input
                      id="exit-intent-email"
                      type="email"
                      {...register('email')}
                      className={getInputClass(errors.email)}
                      placeholder="you@email.com"
                      aria-invalid={Boolean(errors.email)}
                    />
                    <FieldError message={errors.email?.message} id="exit-intent-email-error" />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className="ui-btn ui-btn-primary mt-2 w-full disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? 'Submitting...' : 'Request Free Consultation'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
