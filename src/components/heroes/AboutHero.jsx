import BaseHero from './BaseHero'

const milestones = [
  { year: '2014', text: 'Founder-led execution journey begins in Delhi NCR.' },
  { year: '2019', text: 'Construction, sourcing, and advisory expand under one brand.' },
  { year: '2026', text: 'Premium digital presence aligned to the company vision.' },
]

export default function AboutHero({ team }) {
  return (
    <BaseHero
      title="Premium construction and real-estate guidance built on trust, execution discipline, and long-term credibility."
      subtitle="With 12+ years of founder-led experience, 25+ projects, and active work across Delhi NCR, SSR Group Civil brings dependable planning, execution, and advisory under one trusted brand."
      description="We combine construction expertise, project coordination, sourcing support, and practical property guidance to help clients move forward with more confidence, better quality standards, and a more professional delivery experience."
      actions={[
        { label: 'Learn More', href: '#hero-next' },
        { label: 'Meet The Team', href: '#team-section', variant: 'secondary' },
      ]}
      backgroundImage="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=80"
      scrollTarget="#hero-next"
      aside={
        <div className="ui-panel">
          <div className="section-heading__eyebrow">Milestones</div>
          <div className="grid gap-3">
            {milestones.map((milestone) => (
              <div key={milestone.year} className="rounded-[8px] border border-[#e5e5e5] p-4">
                <strong className="block text-[var(--color-primary)]">{milestone.year}</strong>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">{milestone.text}</p>
              </div>
            ))}
          </div>
          <div className="section-heading__eyebrow mt-4">Team Preview</div>
          <div className="grid gap-3">
            {team.slice(0, 3).map((member) => (
              <div key={member.name} className="rounded-[8px] border border-[#e5e5e5] p-4">
                <strong className="block text-[var(--color-primary)]">{member.name}</strong>
                <span className="block text-sm text-[var(--color-accent)]">{member.role}</span>
              </div>
            ))}
          </div>
        </div>
      }
    />
  )
}
