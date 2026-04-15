import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NAV_LINKS, SITE } from '../constants'
import './Navbar.css'

export default function Navbar({ onQuoteClick }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location])

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner container">
        <Link to="/" className="navbar-logo" aria-label="SSR Group Home">
          <div className="navbar-logo-icon">SSR</div>
          <div className="navbar-logo-text">
            <span className="navbar-brand">{SITE.name}</span>
            <span className="navbar-tagline">{SITE.tagline}</span>
          </div>
        </Link>

        <button
          className="navbar-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          <span className={`hamburger ${mobileOpen ? 'open' : ''}`}>
            <span /><span /><span />
          </span>
        </button>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/login" className="navbar-link">Login</Link>
          <button className="btn btn-gold btn-sm navbar-cta" onClick={onQuoteClick}>
            Free Quote
          </button>
        </div>
      </div>
    </nav>
  )
}
