import { screen } from '@testing-library/react'
import Button from '../../src/components/ui/Button'
import HeroSection from '../../src/components/ui/HeroSection'
import ProjectCard from '../../src/components/ui/ProjectCard'
import { renderWithProviders } from '../utils/renderWithProviders'

describe('visual design system primitives', () => {
  test('renders primary, secondary, and tertiary button variants with spec classes', () => {
    renderWithProviders(
      <div>
        <Button>Primary Action</Button>
        <Button variant="secondary">Secondary Action</Button>
        <Button variant="tertiary">Tertiary Action</Button>
      </div>
    )

    expect(screen.getByRole('button', { name: /primary action/i })).toHaveClass('ui-btn', 'ui-btn-primary')
    expect(screen.getByRole('button', { name: /secondary action/i })).toHaveClass('ui-btn', 'ui-btn-secondary')
    expect(screen.getByRole('button', { name: /tertiary action/i })).toHaveClass('ui-btn', 'ui-btn-tertiary')
  })

  test('renders a hero section with spec CTA structure and trust badges', () => {
    renderWithProviders(
      <HeroSection
        title="Premium Construction & Real Estate Solutions"
        subtitle="Building Dreams in Delhi NCR"
        backgroundImage="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80"
        actions={[
          { label: 'Get Quote', href: '#quote' },
          { label: 'View Projects', href: '#projects', variant: 'secondary' },
        ]}
        stats={[
          { value: '12+', label: 'Years in business' },
          { value: '250+', label: 'Projects completed' },
          { value: '500+', label: 'Happy clients' },
        ]}
      />
    )

    expect(screen.getByRole('heading', { level: 1, name: /premium construction & real estate solutions/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /get quote/i })).toHaveClass('ui-btn', 'ui-btn-primary')
    expect(screen.getByRole('link', { name: /view projects/i })).toHaveClass('ui-btn', 'ui-btn-secondary')
    expect(screen.getByText(/years in business/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/scroll down to next section/i)).toBeInTheDocument()
  })

  test('renders a project card with image, category, summary, and action', () => {
    renderWithProviders(
      <ProjectCard
        title="Luxury Villa — Sector 1"
        category="Residential"
        description="Premium custom home with integrated civil, interior, and finishing services."
        image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"
        action={{ label: 'View Details', to: '/projects' }}
      />
    )

    expect(screen.getByRole('img', { name: /luxury villa — sector 1/i })).toBeInTheDocument()
    expect(screen.getByText(/residential/i)).toBeInTheDocument()
    expect(screen.getByText(/premium custom home/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view details/i })).toHaveClass('ui-btn', 'ui-btn-tertiary')
  })
})
