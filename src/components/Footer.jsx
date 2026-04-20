import { Link } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa'
import { SITE, SOCIAL, WHATSAPP_URL } from '../constants'
import Button from './ui/Button'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div className="site-footer__copy">
            <div className="site-footer__brand">
              <img src={SITE.logo} alt="SSR Group Civil logo" />
              <div>
                <strong>{SITE.name}</strong>
                <span>{SITE.tagline}</span>
              </div>
            </div>
            <p>Premium engineering, construction, real-estate advisory, and execution support for clients across Delhi NCR.</p>
            <p>{SITE.address}</p>
            <p>{SITE.phone}</p>
            <p>{SITE.email}</p>
          </div>

          <div className="site-footer__column">
            <h4>Services</h4>
            <div className="site-footer__links">
              <Link to="/services">Residential Construction</Link>
              <Link to="/services">Commercial Projects</Link>
              <Link to="/services">Interior Design</Link>
              <Link to="/services">Renovation Services</Link>
              <Link to="/services">Material Supply</Link>
            </div>
          </div>

          <div className="site-footer__column">
            <h4>Company</h4>
            <div className="site-footer__links">
              <Link to="/">Home</Link>
              <Link to="/projects">Portfolio</Link>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact</Link>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp Support</a>
            </div>
          </div>

          <div className="site-footer__column">
            <h4>Quick Action</h4>
            <p>Need a faster response for a project enquiry or quotation request?</p>
            <div style={{ marginTop: '16px' }}>
              <Button as="a" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                Get Quote
              </Button>
            </div>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <div className="site-footer__social">
            <a aria-label="Instagram" href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a aria-label="LinkedIn" href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
            <a aria-label="Facebook" href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a aria-label="WhatsApp" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
