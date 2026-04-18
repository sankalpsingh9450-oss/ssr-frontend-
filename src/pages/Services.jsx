import { SERVICES, WHATSAPP_URL, SITE } from '../constants'
import { useScrollReveal, useTilt } from '../hooks'
import './Services.css'

const SERVICE_PILLARS = [
  { label: 'Advisory', text: 'Property, feasibility, and pre-construction thinking.' },
  { label: 'Execution', text: 'Residential, commercial, interior, and renovation delivery.' },
  { label: 'Supply', text: 'Materials, partner network, and procurement support.' },
]

function ServiceDetailCard({ service, index, onQuoteClick }) {
  const [ref, vis] = useScrollReveal()
  const tiltRef = useTilt(5)
  const isEven = index % 2 === 0

  return (
    <div ref={ref} className={`svc-detail ${isEven ? 'reveal-left' : 'reveal-right'} ${vis ? 'visible' : ''}`}>
        <div className={`svc-detail-inner ${isEven ? '' : 'svc-reverse'}`}>
        <div className="svc-detail-img" ref={tiltRef}>
          <img src={service.img} alt={service.title} loading="lazy" />
          <div className="svc-detail-icon-float">{service.title.split(' ')[0]}</div>
        </div>
        <div className="svc-detail-content">
          <span className="section-label">Service System</span>
          <h3>{service.title}</h3>
          <p>{service.desc}</p>
          <ul className="svc-features">
            {service.features.map((f, i) => (
              <li key={i}><span className="svc-check">✓</span> {f}</li>
            ))}
          </ul>
          <div className="svc-detail-btns">
            <button className="btn btn-gold btn-sm" onClick={onQuoteClick}>Get Quote</button>
            <a className="btn btn-outline-dark btn-sm" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Services({ onQuoteClick }) {
  const [headerRef, headerVis] = useScrollReveal()
  const [pillarRef, pillarVis] = useScrollReveal()

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero-shell">
          <div className="page-hero-content">
            <div className="section-label">What We Offer</div>
            <h1>Our Services</h1>
            <p>Comprehensive construction, real estate, procurement, and partner systems designed to feel as premium and structured as the new SSR identity.</p>
            <div className="page-hero-tags">
              {SERVICE_PILLARS.map((item) => <span key={item.label}>{item.label}</span>)}
            </div>
          </div>
          <div className="page-hero-brand-card">
            <img src={SITE.logo} alt="SSR Group Civil logo" />
            <div className="page-hero-brand-copy">
              <span>Service Matrix</span>
              <p>Each service now sits inside a stronger architectural brand system, not a generic services list.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section svc-pillars-section">
        <div className="container">
          <div ref={pillarRef} className={`svc-pillars-grid reveal ${pillarVis ? 'visible' : ''}`}>
            {SERVICE_PILLARS.map((item) => (
              <article key={item.label} className="svc-pillar-card">
                <span>{item.label}</span>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div ref={headerRef} className={`section-header reveal ${headerVis ? 'visible' : ''}`}>
            <h2 className="section-title">Everything you need to brief, build, source, and scale</h2>
            <p className="section-sub">Instead of feeling like unrelated offerings, the service stack is now framed as one joined-up operating model for clients and partners.</p>
          </div>
          <div className="svc-details-list">
            {SERVICES.map((s, i) => (
              <ServiceDetailCard key={s.id} service={s} index={i} onQuoteClick={onQuoteClick} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
