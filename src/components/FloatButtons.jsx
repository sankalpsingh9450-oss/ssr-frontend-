import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SOCIAL, WHATSAPP_URL } from '../constants'
import { FaWhatsapp, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa'
import './FloatButtons.css'

const socials = [
  { href: WHATSAPP_URL, icon: <FaWhatsapp />, cls: 'float-wa', label: 'WhatsApp' },
  { href: SOCIAL.instagram, icon: <FaInstagram />, cls: 'float-insta', label: 'Instagram' },
  { href: SOCIAL.linkedin, icon: <FaLinkedinIn />, cls: 'float-linkedin', label: 'LinkedIn' },
  { href: SOCIAL.youtube, icon: <FaYoutube />, cls: 'float-yt', label: 'YouTube' },
]

export default function FloatButtons() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="float-container">
      <AnimatePresence>
        {expanded && socials.map((s, i) => (
          <motion.a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`float-btn ${s.cls}`}
            title={s.label}
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 10 }}
            transition={{ delay: i * .06, duration: .25, ease: [.175, .885, .32, 1.275] }}
          >
            {s.icon}
          </motion.a>
        ))}
      </AnimatePresence>
      <button
        className={`float-btn float-toggle ${expanded ? 'open' : ''}`}
        onClick={() => setExpanded(!expanded)}
        aria-label="Social links"
      >
        <span className="float-toggle-icon">{expanded ? '×' : '💬'}</span>
      </button>
    </div>
  )
}
