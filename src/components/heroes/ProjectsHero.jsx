import { useEffect, useMemo, useState } from 'react'
import BaseHero from './BaseHero'

function Counter({ value, label }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let frame
    const start = performance.now()
    const duration = 900
    const update = (time) => {
      const progress = Math.min((time - start) / duration, 1)
      setDisplay(Math.round(value * progress))
      if (progress < 1) frame = requestAnimationFrame(update)
    }
    frame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frame)
  }, [value])

  return (
    <div className="rounded-[8px] border border-[#e5e5e5] p-4">
      <strong className="block text-[28px] leading-none text-[var(--color-accent)]">{display}+</strong>
      <span className="mt-2 block text-sm text-[var(--color-text-muted)]">{label}</span>
    </div>
  )
}

export default function ProjectsHero({ filter, onFilterChange, projects }) {
  const projectFilters = useMemo(() => ['All', ...new Set(projects.map((project) => project.type))], [projects])
  const latest = projects[0]

  return (
    <BaseHero
      title="Project portfolio with residential and commercial delivery highlights."
      subtitle={`Latest showcase: ${latest?.title || 'Featured Project'}`}
      description="Browse projects by category, view representative work, and use the portfolio to understand the scale and range of our execution."
      actions={[
        { label: 'View All Projects', href: '#project-grid' },
        { label: 'Contact Us', to: '/contact', variant: 'secondary' },
      ]}
      backgroundImage={latest?.img || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1800&q=80'}
      scrollTarget="#hero-next"
      stats={[]}
      aside={
        <div className="ui-panel">
          <div className="field-choice-grid">
            {projectFilters.map((projectFilter) => (
              <button
                key={projectFilter}
                type="button"
                onClick={() => onFilterChange(projectFilter)}
                className={`ui-btn ${filter === projectFilter ? 'ui-btn-primary' : 'ui-btn-secondary'} justify-center`}
              >
                {projectFilter}
              </button>
            ))}
          </div>
          <div className="mt-4 grid gap-3">
            <Counter value={24} label="Residential and commercial showcases" />
            <Counter value={12} label="Featured developments in NCR" />
            <Counter value={9} label="Current project categories" />
          </div>
        </div>
      }
    />
  )
}
