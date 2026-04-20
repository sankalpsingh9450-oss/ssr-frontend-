import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Navbar from '../../src/components/Navbar'
import { renderWithProviders } from '../utils/renderWithProviders'

const navigateMock = jest.fn()
const clearSessionMock = jest.fn()
const getSessionMock = jest.fn()

jest.mock('../../src/lib/session', () => ({
  clearSession: (...args) => clearSessionMock(...args),
  getSession: (...args) => getSessionMock(...args),
}))

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

describe('Navbar mobile menu', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('opens drawer and reveals service submenu', async () => {
    getSessionMock.mockReturnValue(null)
    renderWithProviders(<Navbar onQuoteClick={jest.fn()} />)
    const user = userEvent.setup()

    await user.click(screen.getByLabelText(/open navigation menu/i))
    expect(screen.getByLabelText(/close navigation menu/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /services/i }))
    expect(screen.getByText(/residential construction/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^account$/i })).toBeInTheDocument()
  })

  test('shows profile and logout when session exists', async () => {
    getSessionMock.mockReturnValue({ email: 'client@example.com', name: 'SSR Client' })
    renderWithProviders(<Navbar onQuoteClick={jest.fn()} />)
    const user = userEvent.setup()

    await user.click(screen.getByLabelText(/open navigation menu/i))
    await user.click(screen.getByRole('button', { name: /logout/i }))

    expect(clearSessionMock).toHaveBeenCalled()
    expect(navigateMock).toHaveBeenCalledWith('/login')
  })
})
