import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useScrollReveal, useCountUp, useTilt } from '../hooks'
import { SERVICES, TESTIMONIALS, WHATSAPP_URL, PROPERTY_TYPES, MATERIAL_CATEGORIES } from '../constants'
import './Home.css'

function StatCounter({ target, suffix = '', label }) {
  const [ref, isVisible] = useScrollReveal()
  const [count, start] = useCountUp(target)
  if (isVisible) start()
  return (
    <div className="hero-stat" ref={ref}>
      <div className="hero-stat-num">{count}{suffix}</div>
      <div className="hero-stat-label">{label}</div>
    </div>
  )
}

function ServiceCard({ service, index }) {
  const [ref, isVisible] = useScrollReveal()
  const tiltRef = useTilt(6)
  return (
    <div ref={ref} className={`reveal stagger-${index + 1} ${isVisible ? 'visible' : ''}`}>
      <Link to="/services" className="service-card" ref={tiltRef}>
        <div className="service-card-img">
          <img src={service.img} alt={service.title} loading="lazy" />
          <div className="service-card-overlay" />
        </div>
        <div className="service-card-body">
          <span className="service-card-icon">{service.icon}</span>
          <h3>{service.title}</h3>
          <p>{service.short}</p>
        </div>
      </Link>
    </div>
  )
}

function TestimonialCard({ testimonial, index }) {
  const [ref, isVisible] = useScrollReveal()
  return (
    <div ref={ref} className={`testimonial-card reveal stagger-${index + 1} ${isVisible ? 'visible' : ''}`}>
      <div className="testimonial-stars">{'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}</div>
      <blockquote>"{testimonial.text}"</blockquote>
      <div className="testimonial-author">— {testimonial.name}</div>
      <div className="testimonial-project">{testimonial.project}</div>
    </div>
  )
}

function MaterialCard({ material, index }) {
  const [ref, isVisible] = useScrollReveal()
  return (
    <div ref={ref} className={`material-card reveal stagger-${index + 1} ${isVisible ? 'visible' : ''}`}>
      <div className="material-icon">{material.icon}</div>
      <h4>{material.name}</h4>
      <p>{material.brands}</p>
    </div>
  )
}

export default function Home({ onQuoteClick }) {
  const [servicesRef, servicesVisible] = useScrollReveal()
  const [materialsRef, materialsVisible] = useScrollReveal()
  const [testimonialsRef, testimonialsVisible] = useScrollReveal()
  const [ctaRef, ctaVisible] = useScrollReveal()

  return (
    <>
      <section className="hero">
        <div className="hero-bg">
          <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80" alt="" aria-hidden="true" />
          <div className="hero-bg-overlay" />
        </div>
        <div className="hero-particles" aria-hidden="true">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 8}s`,
            }} />
          ))}
        </div>

        <div className="hero-inner container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .8, ease: [.4, 0, .2, 1] }}
          >
            <div className="hero-badge"><span className="hero-badge-dot" /> Serving Delhi NCR</div>
            <h1>Build Your Dream.<br /><span className="text-gold">We Handle the Rest.</span></h1>
            <p className="hero-sub">Premium construction and real estate solutions at the most competitive margins. Submit your requirements — sit back and relax.</p>
            <div className="hero-btns">
              <button className="btn btn-gold btn-lg" onClick={onQuoteClick}>Get Free Quote ✨</button>
              <a className="btn btn-outline btn-lg" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">💬 WhatsApp Us</a>
            </div>
            <div className="hero-stats-row">
              <StatCounter target={98} suffix="%" label="Client Satisfaction" />
              <StatCounter target={150} suffix="+" label="Projects Delivered" />
              <StatCounter target={24} suffix="/7" label="Support Available" />
            </div>
          </motion.div>

          <motion.div className="hero-form-card" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .8, delay: .2, ease: [.4, 0, .2, 1] }}>
            <h3>🔍 Find Your Property</h3>
            <p>Tell us what you're looking for and we'll match you.</p>
            <div className="form-group"><label>Property Type</label><select className="form-input form-input-dark">{PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
            <div className="form-group"><label>Budget Range</label><input className="form-input form-input-dark" placeholder="e.g. 40L — 70L" /></div>
            <div className="form-group"><label>Your Phone</label><input className="form-input form-input-dark" placeholder="+91-XXXXX XXXXX" /></div>
            <button className="btn btn-gold btn-full">Find My Property →</button>
          </motion.div>
        </div>
        <div className="hero-scroll-hint" aria-hidden="true"><div className="scroll-mouse"><div className="scroll-dot" /></div><span>Scroll to explore</span></div>
      </section>

      <section className="section section-offwhite" id="services">
        <div className="container">
          <div ref={servicesRef} className={`section-header reveal ${servicesVisible ? 'visible' : ''}`}>
            <div className="section-label">What We Offer</div>
            <h2 className="section-title">Comprehensive Construction & Real Estate Solutions</h2>
            <p className="section-sub">From foundations to finishing, property search to materials — everything under one roof.</p>
          </div>
          <div className="services-grid">{SERVICES.slice(0, 6).map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}</div>
          <div className="text-center" style={{ marginTop: 40 }}><Link to="/services" className="btn btn-outline-dark">View All Services →</Link></div>
        </div>
      </section>

      <section className="section" id="materials">
        <div className="container">
          <div ref={materialsRef} className={`section-header reveal ${materialsVisible ? 'visible' : ''}`}>
            <div className="section-label">Building Materials</div>
            <h2 className="section-title">Premium Materials, Competitive Prices</h2>
            <p className="section-sub">Source quality building materials through our trusted network of top brands.</p>
          </div>
          <div className="materials-grid">{MATERIAL_CATEGORIES.map((m, i) => <MaterialCard key={i} material={m} index={i} />)}</div>
        </div>
      </section>

      <section className="section section-dark" id="testimonials">
        <div className="container">
          <div ref={testimonialsRef} className={`section-header reveal ${testimonialsVisible ? 'visible' : ''}`}>
            <div className="section-label">Client Stories</div>
            <h2 className="section-title">What Our Clients Say</h2>
          </div>
          <div className="testimonials-grid">{TESTIMONIALS.map((t, i) => <TestimonialCard key={i} testimonial={t} index={i} />)}</div>
        </div>
      </section>

      <section className="cta-banner" id="cta">
        <div ref={ctaRef} className={`container text-center reveal ${ctaVisible ? 'visible' : ''}`}>
          <h2>Ready to Build Something Great?</h2>
          <p>Get your free quotation or complete BOQ — absolutely free. No hidden charges, no obligations.</p>
          <div className="cta-btns">
            <button className="btn btn-gold btn-lg" onClick={onQuoteClick}>Get Free Quotation ✨</button>
            <a className="btn btn-outline btn-lg" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">💬 Chat on WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  )
}
