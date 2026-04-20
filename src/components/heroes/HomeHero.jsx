import BaseHero from './BaseHero'

const TRUST_BADGES = [
  { value: '1+', label: 'Years in business' },
  { value: '5', label: 'Projects completed' },
  { value: '25', label: 'Happy clients' },
]

export default function HomeHero({ onQuoteClick }) {
  return (
    <BaseHero
      title="Premium Construction & Real Estate Solutions"
      subtitle="Building Dreams in Delhi NCR"
      description="Trusted construction, civil consultancy, property advisory, and project delivery for residential and commercial clients who want premium execution with transparent communication."
      actions={[
        { label: 'Get Quote', onClick: onQuoteClick },
        { label: 'View Portfolio', to: '/projects', variant: 'secondary' },
      ]}
      stats={TRUST_BADGES}
      backgroundImage="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1800&q=80"
      scrollTarget="#hero-next"
    />
  )
}
