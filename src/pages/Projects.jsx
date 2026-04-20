import { useMemo, useState } from 'react'
import { PROJECTS } from '../constants'
import ProjectsHero from '../components/heroes/ProjectsHero'
import ProjectCard from '../components/ui/ProjectCard'
import SectionHeading from '../components/ui/SectionHeading'

export default function Projects() {
  const [filter, setFilter] = useState('All')

  const filteredProjects = useMemo(() => {
    if (filter === 'All') return PROJECTS
    return PROJECTS.filter((project) => project.type === filter)
  }, [filter])

  return (
    <>
      <ProjectsHero filter={filter} onFilterChange={setFilter} projects={PROJECTS} />

      <section className="section" id="hero-next">
        <div className="container">
          <SectionHeading
            eyebrow="Portfolio"
            title="Residential and commercial project highlights from across Delhi NCR."
            description="A structured portfolio grid makes it easier to browse project types and compare the range of our work."
          />
          <div id="project-grid" className="site-grid-3">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.title}
                title={project.title}
                category={project.type}
                description={`${project.status} • ${project.area}`}
                image={project.img}
                location="Delhi NCR"
                action={{ label: 'View Details', to: '/contact' }}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
