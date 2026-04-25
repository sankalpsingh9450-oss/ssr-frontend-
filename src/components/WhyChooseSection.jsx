import { motion } from 'framer-motion'
import { FiCheckCircle, FiClock, FiDollarSign, FiShield } from 'react-icons/fi'
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

export default function WhyChooseSection() {
  return (
    <section className="section section-surface">
      <div className="container">
        <SectionHeading
          eyebrow="Why Choose SSR Group"
          title="Operational trust signals that make project decisions easier."
          description="We focus on response speed, predictable delivery, clear pricing, and professionalism that supports both residential and commercial requirements."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {FEATURES.map(({ title, description, Icon }, index) => (
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
          ))}
        </div>
      </div>
    </section>
  )
}
