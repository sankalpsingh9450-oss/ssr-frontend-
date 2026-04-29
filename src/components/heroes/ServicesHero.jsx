import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

const CATEGORY_TABS = ['Residential', 'Commercial', 'Renovation']
const INTENT_ACTIONS = [
  { label: 'Build My Property', targetId: 'build-my-property' },
  { label: 'Invest in Real Estate', targetId: 'invest-in-real-estate' },
  { label: 'Source Materials', targetId: 'source-materials' },
]

const itemMotion = (reduced, delay = 0) => ({
  initial: { opacity: 0, y: reduced ? 0 : 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: reduced ? 0.01 : 0.6, delay: reduced ? 0 : delay, ease: 'easeOut' },
})

export default function ServicesHero({
  selectedCategory,
  selectedServiceId,
  services,
  onCategoryChange,
  onServiceChange,
}) {
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, reduceMotion ? 0 : 50])
  const featuredService = services.find((service) => service.id === selectedServiceId) || services[0]

  const handleIntentClick = (targetId) => {
    const target = document.getElementById(targetId)
    if (!target) return
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="page-hero min-h-[70vh] md:min-h-[78vh]">
      <motion.div
        aria-hidden="true"
        className="page-hero__bg"
        style={{
          y,
          backgroundImage:
            "linear-gradient(rgba(16,32,58,0.84), rgba(16,32,58,0.58)), url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1800&q=80')",
        }}
      />

      <div className="container page-hero__content">
        <div className="mx-auto max-w-5xl text-center">
          <motion.h1
            className="text-4xl font-bold tracking-[0.02em] text-white sm:text-5xl lg:text-6xl"
            {...itemMotion(reduceMotion, 0)}
          >
            What Do You Need?
          </motion.h1>

          <motion.div
            className="mt-10 flex flex-col gap-4 md:flex-row md:justify-center"
            {...itemMotion(reduceMotion, 0.18)}
          >
            {INTENT_ACTIONS.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => handleIntentClick(action.targetId)}
                className="inline-flex min-h-16 flex-1 items-center justify-center rounded-xl border border-[#d4af37] bg-transparent px-6 py-4 text-base font-semibold text-white transition-colors duration-200 hover:bg-[#d4af37] hover:text-[#10203a] md:max-w-[280px]"
              >
                {action.label}
              </button>
            ))}
          </motion.div>

          <motion.p
            className="mt-5 text-sm font-medium tracking-[0.08em] text-white/65"
            {...itemMotion(reduceMotion, 0.26)}
          >
            Choose your focus area
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col items-center gap-4"
            {...itemMotion(reduceMotion, 0.34)}
          >
            <div className="flex w-full max-w-3xl flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => onCategoryChange(tab)}
                  className={`inline-flex min-h-12 items-center justify-center rounded-full border px-6 py-3 text-sm font-semibold transition-colors duration-200 ${
                    selectedCategory === tab
                      ? 'border-[#d4af37] bg-[#d4af37] text-[#10203a]'
                      : 'border-white/28 bg-white/8 text-white hover:border-[#d4af37] hover:bg-[#d4af37] hover:text-[#10203a]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="w-full max-w-2xl rounded-2xl border border-white/12 bg-[#10203a]/70 p-5 backdrop-blur-sm">
              <label htmlFor="service-selector" className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
                Featured service
              </label>
              <select
                id="service-selector"
                value={featuredService?.id || ''}
                onChange={(event) => onServiceChange(event.target.value)}
                className="mt-3 min-h-12 w-full rounded-xl border border-white/12 bg-[#0f1d3a] px-4 text-white outline-none transition-colors duration-200 focus:border-[#d4af37]"
              >
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.title}
                  </option>
                ))}
              </select>
              <div className="mt-4">
                <strong className="text-lg text-white">{featuredService?.title}</strong>
                <p className="mt-2 text-sm leading-7 text-white/72">{featuredService?.short}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.a
          href="#hero-next"
          className="page-hero__scroll"
          aria-label="Scroll down to next section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: reduceMotion ? 0 : [0, 8, 0] }}
          transition={{ duration: reduceMotion ? 0.01 : 2, repeat: reduceMotion ? 0 : Infinity, ease: 'easeInOut', delay: 0.75 }}
        >
          <span>Scroll</span>
          <span aria-hidden="true">⌄</span>
        </motion.a>
      </div>
    </section>
  )
}
