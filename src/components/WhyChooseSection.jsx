import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiChevronLeft, FiChevronRight, FiClock, FiDollarSign, FiShield } from 'react-icons/fi'
import SectionHeading from './ui/SectionHeading'

const FEATURES = [
  {
    title: 'On-Time Delivery Guarantee',
    description: 'Structured planning, active coordination, and milestone tracking help us deliver projects with dependable timelines.',
    Icon: FiClock,
  },
  {
    title: 'RERA Certified',
    description: 'We operate with compliance-first thinking and verified processes that build long-term client trust.',
    Icon: FiShield,
  },
  {
    title: '30-Min Response Time',
    description: 'Our team prioritizes fast lead follow-up so enquiries move into real project conversations quickly.',
    Icon: FiCheckCircle,
  },
  {
    title: 'Transparent Pricing',
    description: 'Clear communication, practical estimation, and straightforward scope discussion keep pricing honest from day one.',
    Icon: FiDollarSign,
  },
]

function getVisibleSlides() {
  if (typeof window === 'undefined') return 2
  return window.innerWidth < 768 ? 1 : 2
}

function FeatureCard({ title, description, Icon, index }) {
  return (
    <motion.article
      key={title}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="ui-panel flex items-start gap-4"
    >
      <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] bg-[var(--color-primary)] text-[var(--color-accent)]">
        <Icon className="text-xl" />
      </div>
      <div>
        <h3 className="text-[22px] text-[var(--color-primary)]">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">{description}</p>
      </div>
    </motion.article>
  )
}

export default function WhyChooseSection({ layout = 'grid' }) {
  const trackRef = useRef(null)
  const [visibleSlides, setVisibleSlides] = useState(getVisibleSlides)
  const [currentIndex, setCurrentIndex] = useState(0)
  const maxIndex = Math.max(FEATURES.length - visibleSlides, 0)

  useEffect(() => {
    if (layout !== 'carousel') return undefined

    const handleResize = () => {
      setVisibleSlides(getVisibleSlides())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [layout])

  useEffect(() => {
    if (layout !== 'carousel') return
    setCurrentIndex((index) => Math.min(index, maxIndex))
  }, [layout, maxIndex])

  useEffect(() => {
    if (layout !== 'carousel') return

    const track = trackRef.current
    if (!track) return

    const nextSlide = track.children[currentIndex]
    if (!(nextSlide instanceof HTMLElement)) return

    track.scrollTo({
      left: nextSlide.offsetLeft,
      behavior: 'smooth',
    })
  }, [currentIndex, layout])

  const showPrevious = () => {
    setCurrentIndex((index) => (index <= 0 ? maxIndex : index - 1))
  }

  const showNext = () => {
    setCurrentIndex((index) => (index >= maxIndex ? 0 : index + 1))
  }

  return (
    <section className="section section-surface">
      <div className="container">
        <SectionHeading
          eyebrow="Why Choose SSR Group"
          title="Operational trust signals that make project decisions easier."
          description="We focus on response speed, predictable delivery, clear pricing, and professionalism that supports both residential and commercial requirements."
        />

        {layout === 'carousel' ? (
          <div>
            <div className="mb-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={showPrevious}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#d4af37]/40 bg-[#d4af37] text-[#10203a] shadow-lg shadow-[#d4af37]/20 transition-colors duration-200 hover:bg-[#e0bc4b]"
                aria-label="Previous reasons"
              >
                <FiChevronLeft className="text-xl" />
              </button>
              <button
                type="button"
                onClick={showNext}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#d4af37]/40 bg-[#d4af37] text-[#10203a] shadow-lg shadow-[#d4af37]/20 transition-colors duration-200 hover:bg-[#e0bc4b]"
                aria-label="Next reasons"
              >
                <FiChevronRight className="text-xl" />
              </button>
            </div>

            <div role="region" aria-label="Why choose SSR Group carousel" className="overflow-hidden">
              <div
                ref={trackRef}
                className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {FEATURES.map(({ title, description, Icon }, index) => {
                  const isVisible = index >= currentIndex && index < currentIndex + visibleSlides

                  return (
                    <div
                      key={title}
                      role={isVisible ? 'group' : undefined}
                      aria-label={isVisible ? 'Why choose slide' : undefined}
                      aria-hidden={!isVisible}
                      className="w-full shrink-0 snap-start md:w-[calc((100%-1.25rem)/2)]"
                    >
                      <FeatureCard title={title} description={description} Icon={Icon} index={index} />
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
                  aria-label={`Go to reason slide ${index + 1}`}
                  aria-pressed={currentIndex === index}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentIndex === index ? 'w-8 bg-[#d4af37]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {FEATURES.map(({ title, description, Icon }, index) => (
              <FeatureCard key={title} title={title} description={description} Icon={Icon} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
