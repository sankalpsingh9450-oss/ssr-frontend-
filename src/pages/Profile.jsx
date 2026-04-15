import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SITE } from '../constants'
import './Profile.css'
import './Services.css'

const DEMO_ENQUIRIES = [
  { type: 'Property Search', detail: '3BHK Apartment, Gr. Noida West', date: 'Apr 10, 2026', status: 'reviewed' },
  { type: 'Construction Quote', detail: 'G+2 Independent Floor, Sector 1', date: 'Apr 8, 2026', status: 'pending' },
  { type: 'Material Enquiry', detail: 'Cement — 200 bags, UltraTech', date: 'Apr 5, 2026', status: 'reviewed' },
  { type: 'Free BOQ', detail: 'Residential 3BHK, 1200 sq ft', date: 'Apr 2, 2026', status: 'reviewed' },
]

export default function Profile() {
  const [tab, setTab] = useState('enquiries')

  return (
    <>
      <div className="profile-header">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>
          <div className="profile-avatar-lg">S</div>
          <h2>{SITE.founder}</h2>
          <p className="profile-email">{SITE.email}</p>
          <div className="profile-tabs">
            {['enquiries', 'saved', 'settings'].map(t => (
              <button key={t} className={`profile-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="profile-content">
        {tab === 'enquiries' && (
          <motion.div className="profile-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h4>My Enquiries</h4>
            {DEMO_ENQUIRIES.map((e, i) => (
              <div className="enquiry-item" key={i}>
                <div>
                  <div className="enquiry-type">{e.type}</div>
                  <div className="enquiry-detail">{e.detail} · {e.date}</div>
                </div>
                <span className={`enquiry-status status-${e.status}`}>{e.status}</span>
              </div>
            ))}
          </motion.div>
        )}

        {tab === 'saved' && (
          <motion.div className="profile-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h4>Saved Properties</h4>
            <div className="profile-empty">
              <p>No saved properties yet. Use our property finder to discover listings.</p>
              <Link to="/" className="btn btn-gold btn-sm">Find Properties →</Link>
            </div>
          </motion.div>
        )}

        {tab === 'settings' && (
          <motion.div className="profile-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h4>Account Settings</h4>
            <form onSubmit={e => e.preventDefault()}>
              <div className="form-group"><label>Full Name</label><input className="form-input" defaultValue={SITE.founder} /></div>
              <div className="form-group"><label>Email</label><input className="form-input" defaultValue={SITE.email} /></div>
              <div className="form-group"><label>Phone</label><input className="form-input" defaultValue={SITE.phone} /></div>
              <button className="btn btn-blue" type="submit" style={{ marginTop: 8 }}>Save Changes</button>
            </form>
          </motion.div>
        )}
      </div>
    </>
  )
}
