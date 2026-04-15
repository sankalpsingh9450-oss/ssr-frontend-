import { SERVICES, WHATSAPP_URL } from '../constants'
import { useScrollReveal, useTilt } from '../hooks'
import './Services.css'

function ServiceDetailCard({ service, index, onQuoteClick }) {
  const [ref, vis] = useScrollReveal()
  const tiltRef = useTilt(5)
  const isEven = index % 2 === 0

  return (
    <div ref={ref} className={`svc-detail ${isEven ? 'reveal-left' : 'reveal-right'} ${vis ? 'visible' : ''}`}>
      <div className={`svc-detail-inner ${isEven ? '' : 'svc-reverse'}`}>
        <div className="svc-detail-img" ref={tiltRef}>
          <img src={service.img} alt={service.title} loading="lazy" />
          <div className="svc-detail-icon-float">{service.icon}</div>
        </div>
        <div className="svc-detail-content">
          <span className="section-label">{service.icon} Service</span>
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

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <div className="section-label">What We Offer</div>
            <h1>Our Services</h1>
            <p>Comprehensive construction, real estate, and material solutions — all under one roof.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div ref={headerRef} className={`section-header reveal ${headerVis ? 'visible' : ''}`}>
            <h2 className="section-title">Everything You Need to Build & Find</h2>
            <p className="section-sub">From project planning to finishing touches, we handle every aspect with transparency and quality.</p>
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
