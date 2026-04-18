import { Link } from 'react-router-dom'
import { SITE, SOCIAL, WHATSAPP_URL } from '../constants'
import { FaInstagram, FaLinkedinIn, FaYoutube, FaFacebookF, FaWhatsapp } from 'react-icons/fa'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <img src={SITE.logo} alt="SSR Group Civil logo" />
              </div>
              <div>
                <span className="footer-brand">{SITE.name}</span>
                <span className="footer-tagline">{SITE.tagline}</span>
              </div>
            </div>
            <p className="footer-desc">
              Premium engineering, construction, property advisory, and sourcing for clients who want precision, trust, and execution without the usual chaos.
            </p>
            <div className="footer-proof-strip">
              <span>Delhi NCR Focus</span>
              <span>Free BOQ Support</span>
              <span>HubSpot Lead Sync</span>
            </div>
            <div className="footer-contact-lines">
              <p>{SITE.address}</p>
              <p>{SITE.phone}</p>
              <p>{SITE.email}</p>
            </div>
          </div>

          <div>
            <h4 className="footer-heading">Services</h4>
            <Link to="/services" className="footer-link">Residential Construction</Link>
            <Link to="/services" className="footer-link">Commercial Projects</Link>
            <Link to="/services" className="footer-link">Property Search</Link>
            <Link to="/services" className="footer-link">Interior Design</Link>
            <Link to="/services" className="footer-link">Building Materials</Link>
            <Link to="/services" className="footer-link">Renovation</Link>
          </div>

          <div>
            <h4 className="footer-heading">Explore</h4>
            <Link to="/about" className="footer-link">About Us</Link>
            <Link to="/contact" className="footer-link">Contact Us</Link>
            <Link to="/services" className="footer-link">Project Services</Link>
            <a href="#contact" className="footer-link">Request Callback</a>
            <a href="#cta" className="footer-link">Free Quotation</a>
            <a href="#materials" className="footer-link">Material Sourcing</a>
          </div>

          <div>
            <h4 className="footer-heading">Connect</h4>
            <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="footer-link">Instagram</a>
            <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
            <a href={SOCIAL.youtube} target="_blank" rel="noopener noreferrer" className="footer-link">YouTube</a>
            <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" className="footer-link">Facebook</a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="footer-link">WhatsApp</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {SITE.name}. Built for premium engineering, construction, and development leads.</p>
          <div className="footer-social">
            {[
              { href: SOCIAL.instagram, icon: <FaInstagram /> },
              { href: SOCIAL.linkedin, icon: <FaLinkedinIn /> },
              { href: SOCIAL.youtube, icon: <FaYoutube /> },
              { href: SOCIAL.facebook, icon: <FaFacebookF /> },
              { href: WHATSAPP_URL, icon: <FaWhatsapp /> },
            ].map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="footer-social-link">
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
