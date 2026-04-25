import BaseHero from './BaseHero'

const CATEGORY_TABS = ['Residential', 'Commercial', 'Renovation']
const INTENT_ACTIONS = [
  { label: 'Build My Property', href: '#build-my-property' },
  { label: 'Invest in Real Estate', href: '#invest-in-real-estate' },
  { label: 'Source Materials', href: '#source-materials' },
]

export default function ServicesHero({
  selectedCategory,
  selectedServiceId,
  services,
  onCategoryChange,
  onServiceChange,
  onQuoteClick,
}) {
  const featuredService = services.find((service) => service.id === selectedServiceId) || services[0]

  return (
    <BaseHero
      title="Construction services built around planning, execution, and delivery."
      subtitle="Explore services by category and move into the right solution quickly."
      description="From residential construction to commercial projects, renovation, interiors, and material support, our service system is designed to help clients navigate the right scope with confidence."
      actions={[
        { label: 'Explore All Services', href: '#build-my-property' },
        { label: 'Get Quote', onClick: onQuoteClick, variant: 'secondary' },
      ]}
      backgroundImage="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1800&q=80"
      scrollTarget="#hero-next"
      aside={
        <div className="ui-panel">
          <div>
            <p className="field-legend">Start with your intent</p>
            <div className="mt-3 flex flex-col gap-2">
              {INTENT_ACTIONS.map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="ui-btn ui-btn-secondary justify-center"
                >
                  {action.label}
                </a>
              ))}
            </div>
          </div>
          <div className="field-choice-grid">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => onCategoryChange(tab)}
                className={`ui-btn ${selectedCategory === tab ? 'ui-btn-primary' : 'ui-btn-secondary'} justify-center`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <label htmlFor="service-selector" className="field-legend">Featured service</label>
            <select
              id="service-selector"
              value={featuredService?.id || ''}
              onChange={(event) => onServiceChange(event.target.value)}
              className="field-select"
            >
              {services.map((service) => (
                <option key={service.id} value={service.id}>{service.title}</option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <strong className="text-[var(--color-primary)]">{featuredService?.title}</strong>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">{featuredService?.short}</p>
          </div>
        </div>
      }
    />
  )
}
