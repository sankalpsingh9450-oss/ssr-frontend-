import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Button from './Button'

const itemMotion = (reduced, delay = 0) => ({
  initial: { opacity: 0, y: reduced ? 0 : 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: reduced ? 0.01 : 0.6, delay: reduced ? 0 : delay, ease: 'easeOut' },
})

export default function HeroSection({
  title,
  subtitle,
  description,
  backgroundImage,
  stats = [],
  actions = [],
  children,
  scrollTarget = '#hero-next',
  heightClass = 'min-h-[60vh] md:min-h-[70vh] lg:min-h-screen',
  align = 'center',
}) {
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, reduceMotion ? 0 : 50])

  return (
    <section className={`page-hero ${heightClass}`}>
      <motion.div
        aria-hidden="true"
        className="page-hero__bg"
        style={{
          y,
          backgroundImage: `linear-gradient(rgba(26,37,64,0.76), rgba(26,37,64,0.45)), url('${backgroundImage}')`,
        }}
      />

      <div className="container page-hero__content">
        <div className={`page-hero__grid ${children ? 'page-hero__grid--split' : ''}`}>
          <div className={`page-hero__copy page-hero__copy--${align}`}>
            <motion.h1 {...itemMotion(reduceMotion, 0)}>{title}</motion.h1>
            {subtitle ? <motion.p className="page-hero__subtitle" {...itemMotion(reduceMotion, 0.18)}>{subtitle}</motion.p> : null}
            {description ? <motion.p className="page-hero__description" {...itemMotion(reduceMotion, 0.34)}>{description}</motion.p> : null}
            {actions.length ? (
              <motion.div className="page-hero__actions" {...itemMotion(reduceMotion, 0.48)}>
                {actions.map((action) => (
                  <Button
                    key={action.label}
                    variant={action.variant || 'primary'}
                    as={action.to ? 'link' : action.href ? 'a' : 'button'}
                    to={action.to}
                    href={action.href}
                    onClick={action.onClick}
                    target={action.target}
                    rel={action.rel}
                    size="lg"
                  >
                    {action.label}
                  </Button>
                ))}
              </motion.div>
            ) : null}
          </div>

          {children ? (
            <motion.div className="page-hero__aside" {...itemMotion(reduceMotion, 0.56)}>
              {children}
            </motion.div>
          ) : null}
        </div>

        {stats.length ? (
          <motion.div className="page-hero__stats" {...itemMotion(reduceMotion, 0.62)}>
            {stats.map((stat) => (
              <article key={stat.label} className="page-hero__stat">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
          </motion.div>
        ) : null}

        {scrollTarget ? (
          <motion.a
            href={scrollTarget}
            className="page-hero__scroll"
            aria-label="Scroll down to next section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: reduceMotion ? 0 : [0, 8, 0] }}
            transition={{ duration: reduceMotion ? 0.01 : 2, repeat: reduceMotion ? 0 : Infinity, ease: 'easeInOut', delay: 0.75 }}
          >
            <span>Scroll</span>
            <span aria-hidden="true">⌄</span>
          </motion.a>
        ) : null}
      </div>
    </section>
  )
}
