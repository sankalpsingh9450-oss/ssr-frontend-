import { SITE, TEAM } from '../constants'
import AboutHero from '../components/heroes/AboutHero'
import SectionHeading from '../components/ui/SectionHeading'

const VALUES = [
  { title: 'Transparency', description: 'Clear advice, practical coordination, and straightforward conversations around costs and project expectations.' },
  { title: 'Quality', description: 'A premium approach to materials, finish quality, and execution discipline.' },
  { title: 'Reliability', description: 'Responsive delivery, structured follow-up, and a team that values trust over shortcuts.' },
]

export default function About() {
  return (
    <>
      <AboutHero team={TEAM} />

      <section className="section" id="hero-next">
        <div className="container">
          <div className="site-grid-2">
            <div>
              <SectionHeading
                eyebrow="Our Story"
                title={`${SITE.name} is built for clients who want premium support without unnecessary complexity.`}
                description="We work at the intersection of civil execution, construction planning, real-estate support, and practical project guidance. Our goal is to make the process more trustworthy, more structured, and easier to navigate."
                align="left"
              />
            </div>
            <div className="ui-panel">
              <h3 className="text-[24px] text-[var(--color-primary)]">Why clients choose us</h3>
              <div className="mt-6 grid gap-4">
                {VALUES.map((value) => (
                  <div key={value.title} className="rounded-[8px] border border-[#e5e5e5] p-4">
                    <strong className="block text-[var(--color-primary)]">{value.title}</strong>
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-surface" id="team-section">
        <div className="container">
          <SectionHeading
            eyebrow="Team"
            title="Leadership and team focus"
            description="Meet the people guiding the company vision, project management, and delivery standards."
          />
          <div className="site-grid-3">
            {TEAM.map((member) => (
              <article key={member.name} className="ui-panel">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-[8px] bg-[var(--color-primary)] text-white font-bold">
                  {member.initials}
                </div>
                <h3 className="mt-4 text-[24px] text-[var(--color-primary)]">{member.name}</h3>
                <p className="mt-1 text-sm text-[var(--color-accent)]">{member.role}</p>
                <p className="mt-3 text-sm text-[var(--color-text-muted)]">{member.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
