import { useMemo, useState } from 'react'
import { SERVICES, WHATSAPP_URL } from '../constants'
import ServicesHero from '../components/heroes/ServicesHero'
import ServiceCard from '../components/ui/ServiceCard'
import SectionHeading from '../components/ui/SectionHeading'
import Button from '../components/ui/Button'

const SERVICE_DETAIL_PATHS = {
  residential: '/services/residential-construction',
  commercial: '/services/commercial-projects',
  interior: '/services/interior-renovation',
  renovation: '/services/interior-renovation',
  'property-search': '/services/investment-advisory',
}

export default function Services({ onQuoteClick }) {
  const [selectedCategory, setSelectedCategory] = useState('Residential')
  const [selectedServiceId, setSelectedServiceId] = useState('residential')

  const filteredServices = useMemo(() => {
    if (selectedCategory === 'Residential') {
      return SERVICES.filter((service) => ['residential', 'interior', 'planning', 'property-search'].includes(service.id))
    }
    if (selectedCategory === 'Commercial') {
      return SERVICES.filter((service) => ['commercial', 'planning', 'materials', 'partnership'].includes(service.id))
    }
    return SERVICES.filter((service) => ['renovation', 'interior', 'materials', 'planning'].includes(service.id))
  }, [selectedCategory])

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
            eyebrow="Service Catalogue"
            title="Explore the service matrix for planning, execution, sourcing, and support."
            description="Each service is structured around practical project outcomes, transparent guidance, and premium standards of communication."
          />
          <div id="service-catalogue" className="site-grid-3">
            {filteredServices.map((service) => (
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
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Button onClick={onQuoteClick}>Get Quote</Button>
            <Button as="a" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" variant="secondary">WhatsApp</Button>
          </div>
        </div>
      </section>
    </>
  )
}
