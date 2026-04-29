import { act, fireEvent, screen, within } from '@testing-library/react'
import Home from '../../src/pages/Home'
import { renderWithProviders } from '../utils/renderWithProviders'

describe('Home services carousel', () => {
  const originalInnerWidth = window.innerWidth

  afterEach(() => {
    window.innerWidth = originalInnerWidth
  })

  function renderHomeAtWidth(width = 1280) {
    window.innerWidth = width
    fireEvent(window, new Event('resize'))
    return renderWithProviders(<Home onQuoteClick={jest.fn()} />)
  }

  test('places services between hero and trust sections and shows three cards on desktop', () => {
    renderHomeAtWidth(1280)

    const servicesHeading = screen.getByRole('heading', {
      level: 2,
      name: /professional services aligned to construction, civil, and real-estate requirements\./i,
    })
    const trustHeading = screen.getByRole('heading', {
      level: 2,
      name: /credibility that supports every project conversation\./i,
    })

    expect(
      servicesHeading.compareDocumentPosition(trustHeading) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()

    const carousel = screen.getByRole('region', { name: /services carousel/i })
    const visibleSlides = within(carousel).getAllByRole('group', { name: /service slide/i })

    expect(visibleSlides).toHaveLength(3)
  })

  test('shows one card on mobile and advances with controls and autoplay', () => {
    jest.useFakeTimers()
    renderHomeAtWidth(375)

    const carousel = screen.getByRole('region', { name: /services carousel/i })
    expect(within(carousel).getAllByRole('group', { name: /service slide/i })).toHaveLength(1)
    expect(within(carousel).getByRole('heading', { level: 3, name: /residential construction/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /next services/i }))
    expect(within(carousel).getByRole('heading', { level: 3, name: /commercial projects/i })).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(2000)
    })
    expect(within(carousel).getByRole('heading', { level: 3, name: /interior & renovation/i })).toBeInTheDocument()
    jest.clearAllTimers()
    jest.useRealTimers()
  })

  test('pauses autoplay while hovered and resumes on mouse leave', () => {
    jest.useFakeTimers()
    renderHomeAtWidth(375)

    const carousel = screen.getByRole('region', { name: /services carousel/i })
    fireEvent.mouseEnter(carousel)

    act(() => {
      jest.advanceTimersByTime(4000)
    })
    expect(within(carousel).getByRole('heading', { level: 3, name: /residential construction/i })).toBeInTheDocument()

    fireEvent.mouseLeave(carousel)
    act(() => {
      jest.advanceTimersByTime(2000)
    })
    expect(within(carousel).getByRole('heading', { level: 3, name: /commercial projects/i })).toBeInTheDocument()
    jest.clearAllTimers()
    jest.useRealTimers()
  })
})
