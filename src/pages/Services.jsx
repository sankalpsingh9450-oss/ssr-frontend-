import { useMemo, useState } from 'react'
import { SERVICES } from '../constants'
import ServicesHero from '../components/heroes/ServicesHero'
import ServiceCard from '../components/ui/ServiceCard'
import SectionHeading from '../components/ui/SectionHeading'
import Button from '../components/ui/Button'

const SERVICE_DETAIL_PATHS = {
  residential: '/services/residential-construction',
  commercial: '/services/commercial-projects',
  interior: '/services/interior-renovation',
  renovation: '/services/interior-renovation',
  'property-search': '/services/investment-advisory',
}

const INTENT_SECTIONS = [
  {
    id: 'build-my-property',
    eyebrow: 'Build My Property',
    title: 'Planning, construction, and execution services for building and upgrading spaces.',
    description:
      'For clients who want to build, renovate, or improve a home, office, or commercial property with structured execution support.',
    serviceIds: ['residential', 'commercial', 'interior', 'renovation', 'planning'],
  },
  {
    id: 'invest-in-real-estate',
    eyebrow: 'Invest in Real Estate',
    title: 'Property guidance and market-focused advisory for smarter investment decisions.',
    description:
      'For buyers and investors who want curated opportunities, market clarity, and practical support before committing capital.',
    serviceIds: ['property-search'],
  },
  {
    id: 'source-materials',
    eyebrow: 'Source Materials',
    title: 'Material sourcing and partner support for project execution and business growth.',
    description:
      'For contractors, developers, and project teams looking for trusted supply and network support.',
    serviceIds: ['materials', 'partnership'],
  },
]

export default function Services({ onQuoteClick }) {
  const [selectedCategory, setSelectedCategory] = useState('Residential')
  const [selectedServiceId, setSelectedServiceId] = useState('residential')

  const featuredServices = useMemo(() => {
    if (selectedCategory === 'Residential') {
      return SERVICES.filter((service) => ['residential', 'interior', 'planning', 'property-search'].includes(service.id))
    }
    if (selectedCategory === 'Commercial') {
      return SERVICES.filter((service) => ['commercial', 'planning', 'materials', 'partnership'].includes(service.id))
    }
    return SERVICES.filter((service) => ['renovation', 'interior', 'materials', 'planning'].includes(service.id))
  }, [selectedCategory])

  const groupedSections = useMemo(
    () =>
      INTENT_SECTIONS.map((section) => ({
        ...section,
        services: SERVICES.filter((service) => section.serviceIds.includes(service.id)),
      })),
    []
  )

  return (
    <>
      <ServicesHero
        selectedCategory={selectedCategory}
        selectedServiceId={selectedServiceId}
        services={SERVICES}
        onCategoryChange={setSelectedCategory}
        onServiceChange={setSelectedServiceId}
        onQuoteClick={onQuoteClick}
      />

      <section className="section" id="hero-next">
        <div className="container">
          <SectionHeading
            eyebrow="Featured Services"
            title="A quick look at the service paths clients explore most often."
            description="Use the highlighted cards below to get oriented, then move into the intent-based sections for the full service grouping."
          />
          <div id="service-catalogue" className="site-grid-3">
            {featuredServices.map((service) => (
              <ServiceCard
                key={service.id}
                icon={service.icon}
                title={service.title}
                description={service.desc}
                image={service.img}
                action={{
                  label: 'Learn More',
                  to: SERVICE_DETAIL_PATHS[service.id] || '/services',
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {groupedSections.map((section) => (
        <section key={section.id} id={section.id} className="section">
          <div className="container">
            <SectionHeading
              eyebrow={section.eyebrow}
              title={section.title}
              description={section.description}
            />
            <div className="site-grid-3">
              {section.services.map((service) => (
                <ServiceCard
                  key={service.id}
                  icon={service.icon}
                  title={service.title}
                  description={service.desc}
                  image={service.img}
                  action={{
                    label: 'Learn More',
                    to: SERVICE_DETAIL_PATHS[service.id] || '/services',
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="section">
        <div className="container">
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d4af37]">Need Guidance?</p>
            <h2 className="mt-3 text-3xl font-bold text-[#1a2540] sm:text-4xl">Not sure where to start?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Tell us what you are trying to build, buy, or source, and our team will guide you to the right service path.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button to="/contact">Talk to Our Team</Button>
              <Button onClick={onQuoteClick} variant="secondary">Get Quote</Button>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}
