import { SITE, TEAM } from '../constants'
import { useScrollReveal } from '../hooks'
import './About.css'
import './Services.css'

const COMPANY_FACTS = [
  'Delhi NCR focused execution and advisory',
  'Free BOQ and quotation-led conversion strategy',
  'HubSpot-connected lead handling foundation',
]

function ValueCard({ value, index }) {
  const [ref, vis] = useScrollReveal()
  return (
    <div ref={ref} className={`value-card reveal stagger-${index + 1} ${vis ? 'visible' : ''}`}>
      <div className="value-icon">{value.icon}</div>
      <h3>{value.title}</h3>
      <p>{value.desc}</p>
    </div>
  )
}

function TeamCard({ member, index }) {
  const [ref, vis] = useScrollReveal()
  return (
    <div ref={ref} className={`team-card reveal stagger-${index + 1} ${vis ? 'visible' : ''}`}>
      <div className="team-avatar">{member.initials}</div>
      <h3>{member.name}</h3>
      <div className="team-role">{member.role}</div>
      <p>{member.desc}</p>
    </div>
  )
}

const VALUES = [
  { icon: '🎯', title: 'Transparency', desc: 'No hidden costs, no surprises. Detailed BOQs and clear pricing from day one.' },
  { icon: '💎', title: 'Quality', desc: 'Premium materials and expert craftsmanship in every project we deliver.' },
  { icon: '⚡', title: 'Speed', desc: 'Efficient project management ensures on-time delivery, every time.' },
  { icon: '🤝', title: 'Trust', desc: '98% client satisfaction rate built on integrity and honest communication.' },
  { icon: '💰', title: 'Affordability', desc: 'Construction at the least margin possible — maximum value for your investment.' },
  { icon: '🛡️', title: 'Reliability', desc: '24/7 support and dedicated project managers for complete peace of mind.' },
]

export default function About() {
  const [storyRef, storyVis] = useScrollReveal()
  const [valuesRef, valuesVis] = useScrollReveal()
  const [teamRef, teamVis] = useScrollReveal()
  const [factRef, factVis] = useScrollReveal()

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero-shell">
          <div className="page-hero-content">
            <div className="section-label">Who We Are</div>
          <h1>About SSR Group</h1>
            <p>Building a sharper engineering, construction, and development brand through transparency, systems thinking, and premium delivery discipline.</p>
            <div className="page-hero-tags">
              <span>Founder-Led</span>
              <span>Process-Driven</span>
              <span>Delhi NCR</span>
            </div>
          </div>
          <div className="page-hero-brand-card">
            <img src={SITE.logo} alt="SSR Group Civil logo" />
            <div className="page-hero-brand-copy">
              <span>Brand Principle</span>
              <p>The company story now aligns with the new logo: premium, architectural, and more deliberate.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section about-facts-section">
        <div className="container">
          <div ref={factRef} className={`about-facts-grid reveal ${factVis ? 'visible' : ''}`}>
            {COMPANY_FACTS.map((fact) => (
              <article key={fact} className="about-fact-card">
                <span>SSR Standard</span>
                <p>{fact}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div ref={storyRef} className={`about-grid reveal ${storyVis ? 'visible' : ''}`}>
            <div className="about-img-wrapper">
              <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80" alt="SSR Group Construction" />
              <div className="about-img-accent" />
            </div>
            <div className="about-text">
              <div className="section-label">Our Story</div>
              <h2 className="section-title" style={{ textAlign: 'left' }}>Construction at the least margin possible, with a stronger identity to match</h2>
              <p>SSR Group was founded by <strong>{SITE.founder}</strong> with a simple yet powerful vision — make construction and property search transparent, affordable, and stress-free for everyone in Delhi NCR.</p>
              <p>We believe that quality construction shouldn't come with hidden costs. Every project we undertake is backed by detailed BOQs, competitive material sourcing, and honest timelines.</p>
              <p>Whether you're building your dream home, searching for the perfect commercial space, or sourcing building materials — the business model is intentionally integrated so clients can move through one guided system instead of fragmented vendors.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-cream">
        <div className="container">
          <div ref={valuesRef} className={`section-header reveal ${valuesVis ? 'visible' : ''}`}>
            <div className="section-label">What Drives Us</div>
            <h2 className="section-title">Core values that should be visible in the UI, not only written in the copy</h2>
          </div>
          <div className="values-grid">
            {VALUES.map((v, i) => <ValueCard key={i} value={v} index={i} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div ref={teamRef} className={`section-header reveal ${teamVis ? 'visible' : ''}`}>
            <div className="section-label">Leadership</div>
            <h2 className="section-title">Leadership and operating focus</h2>
          </div>
          <div className="team-grid">
            {TEAM.map((t, i) => <TeamCard key={i} member={t} index={i} />)}
          </div>
        </div>
      </section>
    </>
  )
}
