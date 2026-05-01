import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { SERVICES, SITE } from '../constants'
import ConstructionCostCalculator from '../components/ConstructionCostCalculator'
import HomeHero from '../components/heroes/HomeHero'
import ServiceCard from '../components/ui/ServiceCard'
import SectionHeading from '../components/ui/SectionHeading'
import ContactInquiryForm from '../components/forms/ContactInquiryForm'
import WhyChooseSection from '../components/WhyChooseSection'
import services from '../services'

const TRUST_STATS = [
  { value: '25+', label: 'Projects' },
  { value: '1+', label: 'Years' },
  { value: '98%', label: 'Satisfaction' },
]

const CLIENT_LOGOS = ['Apex Build', 'UrbanNest', 'MetroEdge', 'PrimeSquare', 'BlueStone']
const CAROUSEL_AUTOPLAY_MS = 2000
const SERVICE_CARD_IMAGE_BY_SLUG = {
  'residential-construction': SERVICES.find((service) => service.id === 'residential')?.img,
  'commercial-projects': SERVICES.find((service) => service.id === 'commercial')?.img,
  'interior-renovation': SERVICES.find((service) => service.id === 'interior')?.img,
  'investment-advisory': SERVICES.find((service) => service.id === 'property-search')?.img,
}

function getVisibleSlides() {
  if (typeof window === 'undefined') return 3
  return window.innerWidth < 768 ? 1 : 3
}

function StatGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {TRUST_STATS.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: index * 0.08 }}
          className="rounded-lg border border-[#d4af37]/20 bg-[#1a2540] p-6 text-center shadow-lg shadow-slate-950/10"
        >
          <div className="text-3xl font-bold text-[#d4af37] sm:text-4xl">{stat.value}</div>
          <div className="mt-2 text-sm font-medium uppercase tracking-[0.16em] text-white/80">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  )
}

function ClientLogos() {
  return (
    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {CLIENT_LOGOS.map((logo, index) => (
        <motion.div
          key={logo}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: 0.15 + index * 0.06 }}
          className="flex min-h-16 items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-5 text-center text-sm font-semibold uppercase tracking-[0.18em] text-white/75"
        >
          {logo}
        </motion.div>
      ))}
    </div>
  )
}

function ServicesCarousel() {
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

  const goToSlide = (nextIndex) => {
    setCurrentIndex(nextIndex)
  }

  const showPrevious = () => {
    setCurrentIndex((index) => (index <= 0 ? maxIndex : index - 1))
  }

  const showNext = () => {
    setCurrentIndex((index) => (index >= maxIndex ? 0 : index + 1))
  }

  return (
    <section className="section" id="hero-next">
      <div className="container">
        <SectionHeading
          eyebrow="Services"
          title="Professional services aligned to construction, civil, and real-estate requirements."
          description="We help clients plan, build, source, and manage projects with a premium but practical execution mindset."
        />

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
              aria-label="Previous services"
            >
              <FiChevronLeft className="text-xl" />
            </button>
            <button
              type="button"
              onClick={showNext}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#d4af37]/40 bg-[#d4af37] text-[#10203a] shadow-lg shadow-[#d4af37]/20 transition-colors duration-200 hover:bg-[#e0bc4b]"
              aria-label="Next services"
            >
              <FiChevronRight className="text-xl" />
            </button>
          </div>

          <div
            role="region"
            aria-label="Services carousel"
            className="overflow-hidden"
          >
            <div
              ref={trackRef}
              className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {services.map((service, index) => {
                const isVisible = index >= currentIndex && index < currentIndex + visibleSlides

                return (
                  <div
                    key={service.slug}
                    role={isVisible ? 'group' : undefined}
                    aria-label={isVisible ? 'Service slide' : undefined}
                    aria-hidden={!isVisible}
                    className="w-full shrink-0 snap-start md:w-[calc((100%-3rem)/3)]"
                  >
                    <ServiceCard
                      title={service.title}
                      description={service.description}
                      image={SERVICE_CARD_IMAGE_BY_SLUG[service.slug]}
                      action={{ label: 'Learn More', to: `/services/${service.slug}` }}
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
                onClick={() => goToSlide(index)}
                aria-label={`Go to services slide ${index + 1}`}
                aria-pressed={currentIndex === index}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === index ? 'w-8 bg-[#d4af37]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home({ onQuoteClick }) {
  return (
    <>
      <HomeHero onQuoteClick={onQuoteClick} />

      <ServicesCarousel />

      <section className="bg-[#10203a] py-14 sm:py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d4af37]">Trust & Proof</p>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              Credibility that supports every project conversation.
            </h2>
            <p className="mt-4 text-base leading-7 text-white/70">
              We pair execution-focused project support with a premium client experience across construction,
              advisory, and real-estate requirements in Delhi NCR.
            </p>
          </motion.div>

          <div className="mt-10">
            <StatGrid />
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="rounded-xl border border-white/10 bg-[#16284a] p-6 shadow-xl shadow-slate-950/10"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d4af37]">Client Logos</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Trusted by clients across residential and commercial work.</h3>
                </div>
              </div>
              <div className="mt-6">
                <ClientLogos />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-xl border border-[#d4af37]/25 bg-gradient-to-br from-[#1a2540] to-[#12203a] p-6 shadow-xl shadow-slate-950/10"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d4af37]">Google Reviews</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Review widget placeholder</h3>
              <p className="mt-4 text-sm leading-7 text-white/75">
                Add your live Google Reviews embed or testimonial widget here to strengthen trust before service
                exploration and lead capture.
              </p>
              <div className="mt-6 rounded-lg border border-dashed border-white/20 bg-white/5 px-4 py-8 text-center text-sm text-white/60">
                Google Reviews widget placeholder
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ConstructionCostCalculator mode="compact" />
        </div>
      </section>

      <WhyChooseSection layout="carousel" />

      <section className="section">
        <div className="container">
          <div className="site-grid-2">
            <div className="ui-contact-card">
              <SectionHeading
                eyebrow="Contact"
                title="Start your project conversation today."
                description="Tell us what you’re building, renovating, sourcing, or evaluating, and our team will guide you toward the right next step."
                align="left"
              />
              <div className="mt-6 space-y-3 text-sm text-[var(--color-text-muted)]">
                <p><strong className="text-[var(--color-primary)]">Phone:</strong> {SITE.phone}</p>
                <p><strong className="text-[var(--color-primary)]">Email:</strong> {SITE.email}</p>
                <p><strong className="text-[var(--color-primary)]">Office:</strong> {SITE.address}</p>
              </div>
              <div className="mt-6">
                <button className="ui-btn ui-btn-primary" onClick={onQuoteClick}>Get Free Quote</button>
              </div>
            </div>

            <div className="ui-form-card contact-form-shell">
              <h3 className="text-[24px] text-[var(--color-primary)]">Contact Form</h3>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">Use the form below to send a detailed enquiry to the {SITE.name} team.</p>
              <div className="mt-6">
                <ContactInquiryForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
