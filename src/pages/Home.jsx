import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useScrollReveal, useCountUp, useTilt } from '../hooks'
import { SERVICES, TESTIMONIALS, WHATSAPP_URL, MATERIAL_CATEGORIES, PROJECTS, SITE } from '../constants'
import './Home.css'

const PILLARS = [
  {
    label: 'Engineering Discipline',
    title: 'A brand system built like a project plan',
    text: 'Every quotation, BOQ, vendor discussion, and execution step follows a structured engineering lens instead of ad-hoc coordination.',
  },
  {
    label: 'Construction Delivery',
    title: 'Transparent execution, not vague promises',
    text: 'We anchor every engagement around margin clarity, quality materials, practical design choices, and a realistic delivery rhythm.',
  },
  {
    label: 'Development Mindset',
    title: 'Property, sourcing, and build strategy in one flow',
    text: 'Clients do not need to juggle separate brokers, contractors, planners, and suppliers. The site should reflect that integrated value clearly.',
  },
]

const PROCESS = [
  { step: '01', title: 'Brief & Blueprint', text: 'We capture your property, construction, interior, or sourcing brief with hard constraints first.' },
  { step: '02', title: 'Budget & BOQ', text: 'We shape feasibility, pricing logic, material assumptions, and a clearer execution roadmap.' },
  { step: '03', title: 'Execution Network', text: 'Our teams and partner ecosystem align sourcing, design, and delivery under one operating model.' },
  { step: '04', title: 'Updates & Handover', text: 'You stay informed through structured checkpoints instead of chasing scattered updates.' },
]

const FAQS = [
  {
    q: 'What makes SSR Group different from a typical broker or contractor?',
    a: 'SSR Group combines property advisory, BOQ planning, construction execution, and material sourcing so the client experiences one joined-up workflow instead of fragmented vendors.',
  },
  {
    q: 'Can I get a quotation or BOQ before committing to execution?',
    a: 'Yes. Free quotation and BOQ support is a core conversion offer, and it should remain prominent throughout the website experience.',
  },
  {
    q: 'Do you handle only construction projects?',
    a: 'No. The business also supports property search, building material sourcing, and partner/vendor collaboration across the Delhi NCR market.',
  },
  {
    q: 'How should leads reach your team?',
    a: 'High-intent forms, WhatsApp, and HubSpot-backed CRM capture should all route into one reliable lead handling flow with clear follow-up ownership.',
  },
]

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
      <div className="material-kicker">Approved Supply</div>
      <h4>{material.name}</h4>
      <p>{material.brands}</p>
    </div>
  )
}

function PillarCard({ pillar, index }) {
  const [ref, isVisible] = useScrollReveal()
  return (
    <article ref={ref} className={`pillar-card reveal stagger-${index + 1} ${isVisible ? 'visible' : ''}`}>
      <span className="pillar-label">{pillar.label}</span>
      <h3>{pillar.title}</h3>
      <p>{pillar.text}</p>
    </article>
  )
}

function ProcessCard({ item, index }) {
  const [ref, isVisible] = useScrollReveal()
  return (
    <article ref={ref} className={`process-card reveal stagger-${index + 1} ${isVisible ? 'visible' : ''}`}>
      <span className="process-step">{item.step}</span>
      <h3>{item.title}</h3>
      <p>{item.text}</p>
    </article>
  )
}

function ProjectCard({ project, index }) {
  const [ref, isVisible] = useScrollReveal()
  return (
    <article ref={ref} className={`project-card reveal stagger-${index + 1} ${isVisible ? 'visible' : ''}`}>
      <img src={project.img} alt={project.title} loading="lazy" />
      <div className="project-card-overlay" />
      <div className="project-card-body">
        <div className="project-meta">
          <span>{project.type}</span>
          <span>{project.status}</span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.area}</p>
      </div>
    </article>
  )
}

function FaqItem({ item, index }) {
  const [ref, isVisible] = useScrollReveal()
  return (
    <article ref={ref} className={`faq-item reveal stagger-${index + 1} ${isVisible ? 'visible' : ''}`}>
      <h3>{item.q}</h3>
      <p>{item.a}</p>
    </article>
  )
}

export default function Home({ onQuoteClick }) {
  const [servicesRef, servicesVisible] = useScrollReveal()
  const [materialsRef, materialsVisible] = useScrollReveal()
  const [testimonialsRef, testimonialsVisible] = useScrollReveal()
  const [ctaRef, ctaVisible] = useScrollReveal()
  const [processRef, processVisible] = useScrollReveal()
  const [projectsRef, projectsVisible] = useScrollReveal()
  const [faqRef, faqVisible] = useScrollReveal()

  return (
    <>
      <section className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-inner container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .8, ease: [.4, 0, .2, 1] }}
          >
            <div className="hero-badge"><span className="hero-badge-dot" /> Delhi NCR premium build & advisory studio</div>
            <h1>Engineering-led execution for <span className="text-gold">construction, property, and development.</span></h1>
            <p className="hero-sub">
              The new SSR identity is stronger than a generic real-estate landing page, so the homepage now leads with a darker blueprint aesthetic, clearer trust language, and more structured conversion paths.
            </p>
            <div className="hero-btns">
              <button className="btn btn-gold btn-lg" onClick={onQuoteClick}>Get Free BOQ</button>
              <Link className="btn btn-outline btn-lg" to="/contact">Submit Your Brief</Link>
            </div>
            <div className="hero-stats-row">
              <StatCounter target={98} suffix="%" label="Client Satisfaction" />
              <StatCounter target={24} suffix="/7" label="Lead Capture Support" />
              <StatCounter target={3} suffix="" label="Core Verticals" />
            </div>
          </motion.div>

          <motion.div className="hero-brand-panel" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .8, delay: .2, ease: [.4, 0, .2, 1] }}>
            <div className="hero-logo-frame">
              <img src={SITE.logo} alt="SSR Group Civil premium logo" />
            </div>
            <div className="hero-panel-copy">
              <span>Brand Direction</span>
              <h3>Dark blueprint luxury, not generic construction UI.</h3>
              <p>The logo already communicates premium engineering confidence. The UI now follows that same visual language with graphite surfaces, metallic accents, framed content blocks, and clearer information architecture.</p>
            </div>
            <div className="hero-panel-actions">
              <a className="hero-mini-link" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp Enquiries</a>
              <Link className="hero-mini-link" to="/services">View Service Systems</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section brand-pillar-section">
        <div className="container">
          <div className="section-header brand-pillar-header">
            <div className="section-label">Brand Architecture</div>
            <h2 className="section-title">What the old UI was missing</h2>
            <p className="section-sub">The previous visual system had sections, cards, and CTAs, but it lacked the trust structure, project storytelling, and premium identity the new logo now demands.</p>
          </div>
          <div className="pillar-grid">
            {PILLARS.map((pillar, index) => <PillarCard key={pillar.label} pillar={pillar} index={index} />)}
          </div>
        </div>
      </section>

      <section className="section section-offwhite" id="services">
        <div className="container">
          <div ref={servicesRef} className={`section-header reveal ${servicesVisible ? 'visible' : ''}`}>
            <div className="section-label">Core Systems</div>
            <h2 className="section-title">Three business pillars, expressed with sharper service architecture</h2>
            <p className="section-sub">Service cards now feel like premium disciplines instead of generic landing-page tiles, while still routing users into the same proven flows.</p>
          </div>
          <div className="services-grid">{SERVICES.slice(0, 6).map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}</div>
          <div className="text-center" style={{ marginTop: 40 }}><Link to="/services" className="btn btn-outline-dark">View Full Service Matrix</Link></div>
        </div>
      </section>

      <section className="section section-dark process-section">
        <div className="container">
          <div ref={processRef} className={`section-header reveal ${processVisible ? 'visible' : ''}`}>
            <div className="section-label">Client Flow</div>
            <h2 className="section-title">A clearer process builds more trust than louder marketing</h2>
            <p className="section-sub">One of the major gaps in the old HTML was the absence of a strong process narrative. This section makes the operating model visible before asking for the lead.</p>
          </div>
          <div className="process-grid">
            {PROCESS.map((item, index) => <ProcessCard key={item.step} item={item} index={index} />)}
          </div>
        </div>
      </section>

      <section className="section projects-section">
        <div className="container">
          <div ref={projectsRef} className={`section-header reveal ${projectsVisible ? 'visible' : ''}`}>
            <div className="section-label">Project Stories</div>
            <h2 className="section-title">Projects now feel like proof, not stock decoration</h2>
            <p className="section-sub">The logo suggested a premium development brand, so the portfolio needed a more curated, case-study-like presentation instead of a simple image gallery.</p>
          </div>
          <div className="projects-grid">{PROJECTS.slice(0, 4).map((project, index) => <ProjectCard key={project.title} project={project} index={index} />)}</div>
        </div>
      </section>

      <section className="section material-section" id="materials">
        <div className="container">
          <div ref={materialsRef} className={`section-header reveal ${materialsVisible ? 'visible' : ''}`}>
            <div className="section-label">Supply Network</div>
            <h2 className="section-title">Material sourcing is presented as a premium procurement layer</h2>
            <p className="section-sub">This section now reads less like an e-commerce list and more like an approved sourcing system aligned to the engineering brand.</p>
          </div>
          <div className="materials-grid">{MATERIAL_CATEGORIES.map((m, i) => <MaterialCard key={i} material={m} index={i} />)}</div>
        </div>
      </section>

      <section className="section section-dark" id="testimonials">
        <div className="container">
          <div ref={testimonialsRef} className={`section-header reveal ${testimonialsVisible ? 'visible' : ''}`}>
            <div className="section-label">Trust Signals</div>
            <h2 className="section-title">Proof and voice now sit closer to the core CTA path</h2>
            <p className="section-sub">The old version needed more credibility sections before conversion prompts. Testimonials now support the premium positioning instead of feeling like an afterthought.</p>
          </div>
          <div className="testimonials-grid">{TESTIMONIALS.map((t, i) => <TestimonialCard key={i} testimonial={t} index={i} />)}</div>
        </div>
      </section>

      <section className="section faq-section">
        <div className="container">
          <div ref={faqRef} className={`section-header reveal ${faqVisible ? 'visible' : ''}`}>
            <div className="section-label">Conversion Clarity</div>
            <h2 className="section-title">The website now answers the questions users have before they bounce</h2>
            <p className="section-sub">FAQ content was one of the biggest feature gaps in the old HTML. Adding it improves conversion confidence and reduces ambiguity around the offer.</p>
          </div>
          <div className="faq-grid">{FAQS.map((item, index) => <FaqItem key={item.q} item={item} index={index} />)}</div>
        </div>
      </section>

      <section className="cta-banner" id="cta">
        <div ref={ctaRef} className={`container text-center reveal ${ctaVisible ? 'visible' : ''}`}>
          <h2>Ready to turn the stronger brand into stronger lead quality?</h2>
          <p>Use the structured contact flow, WhatsApp, or free BOQ path. This redesign gives the business a brand system that finally matches the ambition of the new logo.</p>
          <div className="cta-btns">
            <button className="btn btn-gold btn-lg" onClick={onQuoteClick}>Get Free BOQ</button>
            <Link className="btn btn-outline btn-lg" to="/contact">Send Project Brief</Link>
          </div>
        </div>
      </section>
    </>
  )
}
