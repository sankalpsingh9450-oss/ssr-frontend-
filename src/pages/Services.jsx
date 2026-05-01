import { useEffect, useMemo, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { SERVICES } from '../constants'
import ServicesHero from '../components/heroes/ServicesHero'
import ServiceCard from '../components/ui/ServiceCard'
import SectionHeading from '../components/ui/SectionHeading'
import Button from '../components/ui/Button'
import { manpowerServices } from '../services'
import properties from '../properties'

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

const CAROUSEL_AUTOPLAY_MS = 2000

function getVisibleSlides() {
  if (typeof window === 'undefined') return 3
  if (window.innerWidth < 768) return 1
  if (window.innerWidth < 1024) return 2
  return 3
}

function FeaturedServicesCarousel({ services }) {
  const trackRef = useRef(null)
  const [visibleSlides, setVisibleSlides] = useState(getVisibleSlides)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const maxIndex = Math.max(services.length - visibleSlides, 0)

  useEffect(() => {
    const handleResize = () => {
      setVisibleSlides(getVisibleSlides())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setCurrentIndex((index) => Math.min(index, maxIndex))
  }, [maxIndex])

  useEffect(() => {
    if (isHovered || maxIndex === 0) return undefined

    const intervalId = window.setInterval(() => {
      setCurrentIndex((index) => (index >= maxIndex ? 0 : index + 1))
    }, CAROUSEL_AUTOPLAY_MS)

    return () => window.clearInterval(intervalId)
  }, [isHovered, maxIndex])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const nextSlide = track.children[currentIndex]
    if (!(nextSlide instanceof HTMLElement)) return

    track.scrollTo({
      left: nextSlide.offsetLeft,
      behavior: 'smooth',
    })
  }, [currentIndex])

  const showPrevious = () => {
    setCurrentIndex((index) => (index <= 0 ? maxIndex : index - 1))
  }

  const showNext = () => {
    setCurrentIndex((index) => (index >= maxIndex ? 0 : index + 1))
  }

  return (
    <div
      className="mt-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mb-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={showPrevious}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#d4af37]/40 bg-[#d4af37] text-[#10203a] shadow-lg shadow-[#d4af37]/20 transition-colors duration-200 hover:bg-[#e0bc4b]"
          aria-label="Previous featured services"
        >
          <FiChevronLeft className="text-xl" />
        </button>
        <button
          type="button"
          onClick={showNext}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#d4af37]/40 bg-[#d4af37] text-[#10203a] shadow-lg shadow-[#d4af37]/20 transition-colors duration-200 hover:bg-[#e0bc4b]"
          aria-label="Next featured services"
        >
          <FiChevronRight className="text-xl" />
        </button>
      </div>

      <div role="region" aria-label="Featured services carousel" className="overflow-hidden">
        <div
          id="service-catalogue"
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {services.map((service, index) => {
            const isVisible = index >= currentIndex && index < currentIndex + visibleSlides

            return (
              <div
                key={service.id}
                role={isVisible ? 'group' : undefined}
                aria-label={isVisible ? 'Featured service slide' : undefined}
                aria-hidden={!isVisible}
                className="w-full shrink-0 snap-start md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
              >
                <ServiceCard
                  icon={service.icon}
                  title={service.title}
                  description={service.desc}
                  image={service.img}
                  action={{
                    label: 'Learn More',
                    to: SERVICE_DETAIL_PATHS[service.id] || '/services',
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        {Array.from({ length: maxIndex + 1 }, (_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to featured services slide ${index + 1}`}
            aria-pressed={currentIndex === index}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              currentIndex === index ? 'w-8 bg-[#d4af37]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function IntentServicesCarousel({ services, regionLabel }) {
  const trackRef = useRef(null)
  const [visibleSlides, setVisibleSlides] = useState(getVisibleSlides)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const maxIndex = Math.max(services.length - visibleSlides, 0)

  useEffect(() => {
    const handleResize = () => {
      setVisibleSlides(getVisibleSlides())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setCurrentIndex((index) => Math.min(index, maxIndex))
  }, [maxIndex])

  useEffect(() => {
    if (isHovered || maxIndex === 0) return undefined

    const intervalId = window.setInterval(() => {
      setCurrentIndex((index) => (index >= maxIndex ? 0 : index + 1))
    }, CAROUSEL_AUTOPLAY_MS)

    return () => window.clearInterval(intervalId)
  }, [isHovered, maxIndex])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const nextSlide = track.children[currentIndex]
    if (!(nextSlide instanceof HTMLElement)) return

    track.scrollTo({
      left: nextSlide.offsetLeft,
      behavior: 'smooth',
    })
  }, [currentIndex])

  const showPrevious = () => {
    setCurrentIndex((index) => (index <= 0 ? maxIndex : index - 1))
  }

  const showNext = () => {
    setCurrentIndex((index) => (index >= maxIndex ? 0 : index + 1))
  }

  return (
    <div
      className="mt-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mb-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={showPrevious}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#d4af37]/40 bg-[#d4af37] text-[#10203a] shadow-lg shadow-[#d4af37]/20 transition-colors duration-200 hover:bg-[#e0bc4b]"
          aria-label="Previous build my property services"
        >
          <FiChevronLeft className="text-xl" />
        </button>
        <button
          type="button"
          onClick={showNext}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#d4af37]/40 bg-[#d4af37] text-[#10203a] shadow-lg shadow-[#d4af37]/20 transition-colors duration-200 hover:bg-[#e0bc4b]"
          aria-label="Next build my property services"
        >
          <FiChevronRight className="text-xl" />
        </button>
      </div>

      <div role="region" aria-label={regionLabel} className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {services.map((service, index) => {
            const isVisible = index >= currentIndex && index < currentIndex + visibleSlides

            return (
              <div
                key={service.id}
                role={isVisible ? 'group' : undefined}
                aria-label={isVisible ? 'Build my property service slide' : undefined}
                aria-hidden={!isVisible}
                className="w-full shrink-0 snap-start md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
              >
                <ServiceCard
                  icon={service.icon}
                  title={service.title}
                  description={service.desc}
                  image={service.img}
                  action={{
                    label: 'Learn More',
                    to: SERVICE_DETAIL_PATHS[service.id] || '/services',
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        {Array.from({ length: maxIndex + 1 }, (_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to build my property slide ${index + 1}`}
            aria-pressed={currentIndex === index}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              currentIndex === index ? 'w-8 bg-[#d4af37]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function PropertyPreviewCarousel({ items }) {
  const trackRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const maxIndex = Math.max(items.length - 1, 0)

  useEffect(() => {
    setCurrentIndex((index) => Math.min(index, maxIndex))
  }, [maxIndex])

  useEffect(() => {
    if (isHovered || maxIndex === 0) return undefined

    const intervalId = window.setInterval(() => {
      setCurrentIndex((index) => (index >= maxIndex ? 0 : index + 1))
    }, CAROUSEL_AUTOPLAY_MS)

    return () => window.clearInterval(intervalId)
  }, [isHovered, maxIndex])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const nextSlide = track.children[currentIndex]
    if (!(nextSlide instanceof HTMLElement)) return

    track.scrollTo({
      left: nextSlide.offsetLeft,
      behavior: 'smooth',
    })
  }, [currentIndex])

  const showPrevious = () => {
    setCurrentIndex((index) => (index <= 0 ? maxIndex : index - 1))
  }

  const showNext = () => {
    setCurrentIndex((index) => (index >= maxIndex ? 0 : index + 1))
  }

  return (
    <div
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d4af37]">Listed Properties</p>
          <h3 className="mt-2 text-2xl font-bold text-[#1a2540]">Available Apex Aura options</h3>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={showPrevious}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d4af37]/40 bg-[#d4af37] text-[#10203a] shadow-lg shadow-[#d4af37]/20 transition-colors duration-200 hover:bg-[#e0bc4b]"
            aria-label="Previous listed property"
          >
            <FiChevronLeft className="text-lg" />
          </button>
          <button
            type="button"
            onClick={showNext}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d4af37]/40 bg-[#d4af37] text-[#10203a] shadow-lg shadow-[#d4af37]/20 transition-colors duration-200 hover:bg-[#e0bc4b]"
            aria-label="Next listed property"
          >
            <FiChevronRight className="text-lg" />
          </button>
        </div>
      </div>

      <div role="region" aria-label="Listed properties carousel" className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((property, index) => {
            const isVisible = index === currentIndex

            return (
              <div
                key={property.id}
                role={isVisible ? 'group' : undefined}
                aria-label={isVisible ? 'Listed property slide' : undefined}
                aria-hidden={!isVisible}
                className="w-full shrink-0 snap-start"
              >
                <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <img src={property.imageUrl} alt={property.title} className="h-60 w-full object-cover" />
                  <div className="space-y-4 p-5">
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-[#1a2540]">{property.price}</p>
                      <h4 className="text-xl font-semibold text-slate-900">{property.title}</h4>
                      <p className="text-sm font-medium text-slate-500">{property.location}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
                          {property.type}
                        </span>
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                          {property.status}
                        </span>
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                          {property.bhk}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm leading-6 text-slate-600">{property.description}</p>

                    <Link
                      to={`/properties/${property.slug}`}
                      className="inline-flex text-sm font-semibold text-[#1a2540] transition-colors duration-200 hover:text-[#d4af37]"
                    >
                      View Property
                    </Link>
                  </div>
                </article>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        {Array.from({ length: maxIndex + 1 }, (_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to listed property slide ${index + 1}`}
            aria-pressed={currentIndex === index}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              currentIndex === index ? 'w-8 bg-[#d4af37]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

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
  const listedProperties = useMemo(() => properties, [])

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
          <FeaturedServicesCarousel services={featuredServices} />
        </div>
      </section>

      {groupedSections.map((section, index) => (
        <div key={section.id}>
          <section id={section.id} className="section">
            <div className="container">
              <SectionHeading
                eyebrow={section.eyebrow}
                title={section.title}
                description={section.description}
              />
              {section.id === 'build-my-property' ? (
                <IntentServicesCarousel
                  services={section.services}
                  regionLabel="Build my property services carousel"
                />
              ) : section.id === 'invest-in-real-estate' ? (
                <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
                  <div>
                    {section.services.map((service) => (
                      <ServiceCard
                        key={service.id}
                        icon={service.icon}
                        title={service.title}
                        description={service.desc}
                        image={service.img}
                        action={{
                          label: 'Learn More',
                          to: '/properties',
                        }}
                      />
                    ))}
                  </div>
                  <div>
                    <PropertyPreviewCarousel items={listedProperties} />
                  </div>
                </div>
              ) : (
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
              )}
            </div>
          </section>

          {index === 0 ? (
            <section id="manpower-services" className="section">
              <div className="container">
                <SectionHeading
                  eyebrow="Manpower Services"
                  title="On-demand manpower support for active construction and execution teams."
                  description="Access experienced manpower roles for site execution, supervision, coordination, and project delivery support."
                />
                <div className="site-grid-3">
                  {manpowerServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      icon={service.icon ? <service.icon /> : null}
                      title={service.title}
                      description={service.description}
                    />
                  ))}
                </div>
              </div>
            </section>
          ) : null}
        </div>
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
