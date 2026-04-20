import { Link } from 'react-router-dom'
import { PROJECTS, SERVICES, SITE } from '../constants'
import HomeHero from '../components/heroes/HomeHero'
import ServiceCard from '../components/ui/ServiceCard'
import ProjectCard from '../components/ui/ProjectCard'
import SectionHeading from '../components/ui/SectionHeading'
import ContactInquiryForm from '../components/forms/ContactInquiryForm'

export default function Home({ onQuoteClick }) {
  return (
    <>
      <HomeHero onQuoteClick={onQuoteClick} />

      <section className="section" id="hero-next">
        <div className="container">
          <SectionHeading
            eyebrow="Services"
            title="Professional services aligned to construction, civil, and real-estate requirements."
            description="We help clients plan, build, source, and manage projects with a premium but practical execution mindset."
          />
          <div className="site-grid-3">
            {SERVICES.slice(0, 6).map((service) => (
              <ServiceCard
                key={service.id}
                icon={service.icon}
                title={service.title}
                description={service.short}
                image={service.img}
                action={{ label: 'Learn More', to: '/services' }}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-surface">
        <div className="container">
          <SectionHeading
            eyebrow="Projects"
            title="Selected work that reflects our quality and delivery standards."
            description="Browse recent residential and commercial projects to understand the style, scale, and seriousness of our execution."
          />
          <div className="site-grid-3">
            {PROJECTS.slice(0, 3).map((project) => (
              <ProjectCard
                key={project.title}
                title={project.title}
                category={project.type}
                description={`${project.status} • ${project.area}`}
                image={project.img}
                location="Delhi NCR"
                action={{ label: 'View Details', to: '/projects' }}
              />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/projects" className="ui-btn ui-btn-secondary">View All Projects</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="site-grid-2">
            <div className="ui-contact-card">
              <SectionHeading
                eyebrow="Contact"
                title="Start your project conversation today."
                description="Tell us what you’re building, renovating, sourcing, or evaluating, and our team will guide you toward the right next step."
                align="left"
              />
              <div className="mt-6 space-y-3 text-sm text-[var(--color-text-muted)]">
                <p><strong className="text-[var(--color-primary)]">Phone:</strong> {SITE.phone}</p>
                <p><strong className="text-[var(--color-primary)]">Email:</strong> {SITE.email}</p>
                <p><strong className="text-[var(--color-primary)]">Office:</strong> {SITE.address}</p>
              </div>
              <div className="mt-6">
                <button className="ui-btn ui-btn-primary" onClick={onQuoteClick}>Get Free Quote</button>
              </div>
            </div>

            <div className="ui-form-card">
              <h3 className="text-[24px] text-[var(--color-primary)]">Contact Form</h3>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">Use the form below to send a detailed enquiry to the {SITE.name} team.</p>
              <div className="mt-6">
                <ContactInquiryForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
