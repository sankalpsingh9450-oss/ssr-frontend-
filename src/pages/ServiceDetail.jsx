import { useMemo, useState } from 'react'
import { FiChevronLeft, FiChevronRight, FiClock } from 'react-icons/fi'
import { useParams } from 'react-router-dom'
import FaqAccordion from '../components/FaqAccordion'
import ConstructionCostCalculator from '../components/ConstructionCostCalculator'
import ExitIntentPopup from '../components/ExitIntentPopup'
import ServiceConsultationForm from '../components/ServiceConsultationForm'
import { SITE } from '../constants'
import services from '../services'

export default function ServiceDetail() {
  const { slug } = useParams()
  const service = services.find((item) => item.slug === slug)
  const isInvestmentAdvisory = slug === 'investment-advisory'
  const requiresPlotSize = !isInvestmentAdvisory
  const requiresBudget = isInvestmentAdvisory
  const testimonials = service?.sections?.testimonials || []
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const whatsappMessage = encodeURIComponent(`Hi, I am interested in this service:

${service?.title || ''}

Please share more details and the next steps.`)

  if (!service) {
    return (
      <section className="min-h-screen bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Service not found</h1>
          <p className="mt-3 text-sm text-slate-600">
            The service you are looking for is not available right now.
          </p>
        </div>
      </section>
    )
  }

  const activeTestimonialItem = testimonials.length
    ? testimonials[((activeTestimonial % testimonials.length) + testimonials.length) % testimonials.length]
    : null

  const processSteps = useMemo(() => service.sections?.process || [], [service.sections])

  return (
    <section className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <ExitIntentPopup slug={slug} serviceTitle={service.title} />

      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{service.title}</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">{service.description}</p>
        </div>

        {service.sections ? (
          <>
            {service.sections.timeline?.length ? (
              <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">Project Timeline</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {service.sections.timeline.map((step, index) => (
                    <div key={`${step.title}-${step.duration}`} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d4af37]">Step {index + 1}</p>
                          <h3 className="mt-2 text-lg font-semibold text-slate-900">{step.title}</h3>
                        </div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#1a2540] px-3 py-1 text-xs font-semibold text-white">
                          <FiClock />
                          {step.duration}
                        </span>
                      </div>
                      <p className="mt-4 text-sm leading-7 text-slate-600">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {service.sections.included?.length ? (
              <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">What&apos;s Included</h2>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {service.sections.included.map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                      <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#d4af37] text-xs font-bold text-[#1a2540]">
                        ✓
                      </span>
                      <span className="text-sm leading-6 text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {service.sections.benefits?.length ? (
              <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">Why Invest With Us</h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600">
                  {service.sections.benefits.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {service.sections.offerings?.length ? (
              <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">What We Offer</h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600">
                  {service.sections.offerings.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {service.sections.whyInvest?.length ? (
              <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">Why Invest in This Market</h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600">
                  {service.sections.whyInvest.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {processSteps.length ? (
              <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">Our Process</h2>
                <ol className="mt-4 space-y-4">
                  {processSteps.map((step, index) => (
                    <li key={step} className="flex gap-4 text-slate-600">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1a2540] text-sm font-semibold text-white">
                        {index + 1}
                      </span>
                      <span className="pt-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}

            {service.sections.whyChooseUs?.length ? (
              <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">Why Choose Us</h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600">
                  {service.sections.whyChooseUs.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {service.sections.quality ? (
              <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">Materials & Quality</h2>
                <p className="mt-4 text-base leading-7 text-slate-600">{service.sections.quality}</p>
              </div>
            ) : null}

            {service.sections.closing ? (
              <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                <p className="text-base leading-7 text-slate-600">{service.sections.closing}</p>
              </div>
            ) : null}

            {service.sections.projects?.length ? (
              <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d4af37]">Project Showcase</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-900">Recent project directions in this category</h2>
                  </div>
                  <p className="max-w-xl text-sm leading-7 text-slate-600">
                    These placeholder project cards show the kind of scope, location profile, and delivery style we guide clients through.
                  </p>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {service.sections.projects.map((project) => (
                    <div key={project.title} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d4af37]">{project.type}</p>
                      <h3 className="mt-3 text-lg font-semibold text-slate-900">{project.title}</h3>
                      <p className="mt-2 text-sm font-medium text-slate-500">{project.location}</p>
                      <p className="mt-4 text-sm leading-7 text-slate-600">{project.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {activeTestimonialItem ? (
              <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d4af37]">Client Perspective</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-900">What clients value about this service</h2>
                  </div>
                  {testimonials.length > 1 ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveTestimonial((current) => current - 1)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 text-[#1a2540] transition-colors duration-200 hover:bg-slate-100"
                        aria-label="Previous testimonial"
                      >
                        <FiChevronLeft />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTestimonial((current) => current + 1)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 text-[#1a2540] transition-colors duration-200 hover:bg-slate-100"
                        aria-label="Next testimonial"
                      >
                        <FiChevronRight />
                      </button>
                    </div>
                  ) : null}
                </div>
                <div className="mt-6 rounded-xl bg-slate-50 p-6">
                  <p className="text-lg leading-8 text-slate-700">&ldquo;{activeTestimonialItem.quote}&rdquo;</p>
                  <div className="mt-5">
                    <p className="font-semibold text-slate-900">{activeTestimonialItem.name}</p>
                    <p className="text-sm text-slate-500">{activeTestimonialItem.role}</p>
                  </div>
                </div>
              </div>
            ) : null}

            {service.sections.faqs?.length ? (
              <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">Frequently Asked Questions</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  A quick overview of the questions clients usually ask before booking the next discussion.
                </p>
                <div className="mt-6">
                  <FaqAccordion items={service.sections.faqs} />
                </div>
              </div>
            ) : null}

            {slug === 'residential-construction' ? <ConstructionCostCalculator mode="full" /> : null}

            <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d4af37]">Consultation</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  {isInvestmentAdvisory ? 'Book Investment Consultation' : 'Book Consultation'}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Share your details and we will reach out with guidance tailored to this service. The form already carries the service context in the submission.
                </p>
              </div>
              <div className="mt-6">
                <ServiceConsultationForm
                  serviceTitle={service.title}
                  showPlotSize={requiresPlotSize}
                  showBudget={requiresBudget}
                />
              </div>
            </div>
          </>
        ) : null}

        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">
            {isInvestmentAdvisory ? 'Book Investment Consultation' : 'Ready to discuss your project?'}
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            {isInvestmentAdvisory
              ? 'Speak with our team to shortlist the right opportunities, align your budget, and plan the next move.'
              : 'Speak with our team to plan your scope, budget, and next steps.'}
          </p>
          <a
            href={`https://wa.me/${SITE.phoneRaw}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-[#1a2540] px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#24345b]"
          >
            {isInvestmentAdvisory ? 'Book Investment Consultation' : 'Book Consultation'}
          </a>
        </div>
      </div>

    </section>
  )
}
