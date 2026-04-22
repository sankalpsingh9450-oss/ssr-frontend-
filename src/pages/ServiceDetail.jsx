import { useParams } from 'react-router-dom'
import services from '../services'

export default function ServiceDetail() {
  const { slug } = useParams()
  const service = services.find((item) => item.slug === slug)
  const isInvestmentAdvisory = slug === 'investment-advisory'

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

  return (
    <section className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{service.title}</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">{service.description}</p>
        </div>

        {service.sections ? (
          <>
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

            {service.sections.process?.length ? (
              <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">Our Process</h2>
                <ol className="mt-4 space-y-4">
                  {service.sections.process.map((step, index) => (
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
          <button
            type="button"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-[#1a2540] px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#24345b]"
          >
            {isInvestmentAdvisory ? 'Book Investment Consultation' : 'Book Consultation'}
          </button>
        </div>
      </div>
    </section>
  )
}
