import { motion, useReducedMotion } from 'framer-motion'

export default function SectionHeading({ eyebrow, title, description, align = 'center' }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={`section-heading section-heading--${align}`}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.6, ease: 'easeOut' }}
    >
      {eyebrow ? <span className="section-heading__eyebrow">{eyebrow}</span> : null}
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </motion.div>
  )
}
