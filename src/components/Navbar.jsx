import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FiChevronDown, FiLogOut, FiMenu, FiPhone, FiUser, FiX } from 'react-icons/fi'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp, FaYoutube } from 'react-icons/fa'
import { NAV_LINKS, SERVICES, SITE, SOCIAL, WHATSAPP_URL } from '../constants'
import { clearSession, getSession } from '../lib/session'
import Button from './ui/Button'
import './Navbar.css'

const SERVICE_MENU_ITEMS = [
  { label: 'Residential Construction', match: 'residential' },
  { label: 'Commercial Projects', match: 'commercial' },
  { label: 'Interior Design', match: 'interior' },
  { label: 'Renovation Services', match: 'renovation' },
  { label: 'Material Supply', match: 'materials' },
  { label: 'View All Services', to: '/services' },
]

function getServiceLink(label) {
  const service = SERVICES.find((item) => item.id === label || item.title === label)
  if (!service) return '/services'
  return `/services#service-catalogue`
}

function DesktopHeader({ pathname, onQuoteClick }) {
  return (
    <>
      <nav className="site-nav" aria-label="Main navigation">
        {NAV_LINKS.filter((item) => item.path !== '/blog').map((link) => (
          <Link key={link.path} to={link.path} className={`site-nav__link ${pathname === link.path ? 'active' : ''}`}>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="site-header__actions">
        <Button onClick={onQuoteClick}>Get Quote</Button>
      </div>
    </>
  )
}

function MobileMenu({
  mobileOpen,
  closeMenu,
  servicesOpen,
  setServicesOpen,
  session,
  handleLogout,
  onQuoteClick,
}) {
  return (
    <AnimatePresence>
      {mobileOpen ? (
        <>
          <motion.button
            type="button"
            className="mobile-menu-overlay"
            aria-label="Close navigation overlay"
            onClick={closeMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.aside
            id="mobile-navigation"
            className="mobile-menu"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="mobile-menu__list" style={{ paddingBottom: 0 }}>
              <button type="button" className="mobile-menu__toggle" aria-label="Close navigation menu" onClick={closeMenu}>
                <span>Close</span>
                <FiX />
              </button>
            </div>
            <div className="mobile-menu__list">
              {NAV_LINKS.map((item) => {
                if (item.path === '/blog') {
                  return (
                    <div key={item.path} className="mobile-menu__group">
                      <Link to={item.path} onClick={closeMenu} className="mobile-menu__link">
                        {item.label}
                      </Link>
                    </div>
                  )
                }

                if (item.path === '/services') {
                  return (
                    <div key={item.path} className="mobile-menu__group">
                      <button type="button" className="mobile-menu__toggle" onClick={() => setServicesOpen((current) => !current)}>
                        <span>Services</span>
                        <FiChevronDown style={{ transform: servicesOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease-out' }} />
                      </button>
                      <AnimatePresence initial={false}>
                        {servicesOpen ? (
                          <motion.div
                            className="mobile-menu__submenu"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {SERVICE_MENU_ITEMS.map((service) => (
                              <Link
                                key={service.label}
                                to={service.to || getServiceLink(service.match)}
                                onClick={closeMenu}
                              >
                                {service.label}
                              </Link>
                            ))}
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  )
                }

                return (
                  <div key={item.path} className="mobile-menu__group">
                    <Link to={item.path} onClick={closeMenu} className="mobile-menu__link">
                      {item.label}
                    </Link>
                  </div>
                )
              })}

              <div className="mobile-menu__account">
                {session ? (
                  <>
                    <Link to="/profile" onClick={closeMenu} className="mobile-menu__link">
                      <span className="flex items-center gap-2"><FiUser /> Profile</span>
                    </Link>
                    <button type="button" className="mobile-menu__link" onClick={handleLogout}>
                      <span className="flex items-center gap-2"><FiLogOut /> Logout</span>
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={closeMenu} className="mobile-menu__link">
                    <span className="flex items-center gap-2"><FiUser /> Account</span>
                  </Link>
                )}
                <Button className="w-full mt-3" onClick={() => { closeMenu(); onQuoteClick?.() }}>
                  Get Quote
                </Button>
              </div>
            </div>

            <div className="mobile-menu__footer">
              <strong className="text-[14px] text-[var(--color-primary)]">Contact</strong>
              <div className="mobile-menu__contact">
                <a href={`tel:${SITE.phoneRaw}`}><FiPhone /> {SITE.phone}</a>
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"><FaWhatsapp /> WhatsApp</a>
              </div>
              <div className="mobile-menu__social">
                <a aria-label="Instagram" href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                <a aria-label="LinkedIn" href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
                <a aria-label="YouTube" href={SOCIAL.youtube} target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
                <a aria-label="Facebook" href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
              </div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}

export default function Navbar({ onQuoteClick }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [session, setSession] = useState(() => getSession())

  useEffect(() => {
    setMobileOpen(false)
    setServicesOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleStorage = () => setSession(getSession())
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMobileOpen(false)
        setServicesOpen(false)
      }
    }
    window.addEventListener('storage', handleStorage)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const closeMenu = () => setMobileOpen(false)

  const handleLogout = () => {
    clearSession()
    setSession(null)
    closeMenu()
    navigate('/login')
  }

  return (
    <>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link to="/" className="site-header__brand" aria-label="SSR Group Home">
            <div className="site-header__brand-mark">
              <img src={SITE.logo} alt="SSR Group Civil logo" />
            </div>
            <div className="site-header__brand-copy">
              <span className="site-header__name">{SITE.name}</span>
              <span className="site-header__tagline">{SITE.tagline}</span>
            </div>
          </Link>

          <DesktopHeader pathname={location.pathname} onQuoteClick={onQuoteClick} />

          <button
            type="button"
            className="site-header__menu-button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            <FiMenu size={24} />
          </button>
        </div>
      </header>

      <MobileMenu
        mobileOpen={mobileOpen}
        closeMenu={closeMenu}
        servicesOpen={servicesOpen}
        setServicesOpen={setServicesOpen}
        session={session}
        handleLogout={handleLogout}
        onQuoteClick={onQuoteClick}
      />
    </>
  )
}
