import { motion, useReducedMotion } from 'framer-motion'

const TRUST_BADGES = [
  { value: '12+', label: 'Years in Business' },
  { value: '250+', label: 'Projects Completed' },
  { value: '500+', label: 'Happy Clients' },
]

const backgroundImage =
  "linear-gradient(180deg, rgba(10, 18, 35, 0.28) 0%, rgba(10, 18, 35, 0.82) 100%), linear-gradient(115deg, rgba(26, 37, 64, 0.96) 0%, rgba(26, 37, 64, 0.72) 48%, rgba(12, 18, 31, 0.92) 100%), url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1800&q=80')"

function HeroAction({ href, onClick, className, children }) {
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {children}
      </button>
    )
  }

  return (
    <a href={href} className={className}>
      {children}
    </a>
  )
}

export default function SSRHeroSection({
  onQuoteClick,
  onProjectsClick,
  quoteHref = '#contact',
  projectsHref = '#projects',
}) {
  const shouldReduceMotion = useReducedMotion()

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.14,
        delayChildren: shouldReduceMotion ? 0 : 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.75,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const badgeVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
    show: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.55,
        delay: shouldReduceMotion ? 0 : 0.55 + index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  return (
    <section
      aria-labelledby="ssr-hero-heading"
      className="relative isolate flex min-h-[60svh] w-full overflow-hidden bg-[#1a2540] text-white lg:min-h-screen"
      style={{ backgroundImage, backgroundPosition: 'center', backgroundSize: 'cover' }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.18),transparent_28%),linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:auto,72px_72px,72px_72px] bg-[position:center,center,center] opacity-25"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0c1220] via-[#0c1220]/70 to-transparent"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-between px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex max-w-4xl flex-1 flex-col justify-center"
        >
          <motion.span
            variants={itemVariants}
            className="inline-flex w-fit items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/85 backdrop-blur-sm"
          >
            Delhi NCR Construction Excellence
          </motion.span>

          <motion.h1
            id="ssr-hero-heading"
            variants={itemVariants}
            className="mt-5 max-w-4xl text-balance text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Premium Construction &amp; Real Estate Solutions
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-4 max-w-2xl text-base leading-7 text-white/80 sm:text-lg md:text-xl"
          >
            Building Dreams in Delhi NCR
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base"
          >
            From premium home construction to investment-ready real estate support, SSR Group Civil delivers dependable execution, transparent planning, and trusted on-ground expertise.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-8 flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:flex-wrap"
          >
            <HeroAction
              href={quoteHref}
              onClick={onQuoteClick}
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#d4af37] px-8 text-base font-bold text-[#1a2540] shadow-[0_18px_50px_rgba(212,175,55,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e0bc4d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d4af37]"
            >
              Get Free Quote
            </HeroAction>

            <HeroAction
              href={projectsHref}
              onClick={onProjectsClick}
              className="inline-flex min-h-14 items-center justify-center rounded-full border-2 border-white/70 bg-transparent px-8 text-base font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:border-[#d4af37] hover:text-[#d4af37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              View Our Projects
            </HeroAction>
          </motion.div>
        </motion.div>

        <div className="mt-10 flex flex-col gap-6 lg:mt-12">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {TRUST_BADGES.map((badge, index) => (
              <motion.div
                key={badge.label}
                custom={index}
                variants={badgeVariants}
                initial="hidden"
                animate="show"
                className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-md"
              >
                <div className="text-2xl font-black text-[#d4af37] sm:text-3xl">{badge.value}</div>
                <div className="mt-1 text-sm font-medium text-white/80">{badge.label}</div>
              </motion.div>
            ))}
          </div>

          <motion.a
            href="#hero-next"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -4 }}
            animate={{
              opacity: 1,
              y: shouldReduceMotion ? 0 : [0, 8, 0],
            }}
            transition={{
              duration: shouldReduceMotion ? 0.01 : 1.8,
              repeat: shouldReduceMotion ? 0 : Infinity,
              ease: 'easeInOut',
            }}
            className="mx-auto inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/75 backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d4af37]"
            aria-label="Scroll down to the next section"
          >
            <span>Scroll to explore</span>
            <span aria-hidden="true" className="text-lg leading-none text-[#d4af37]">
              ↓
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  )
}
