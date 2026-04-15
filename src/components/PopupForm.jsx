import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFormSubmit, useScrollLock } from '../hooks'
import { SERVICES } from '../constants'
import './PopupForm.css'

export default function PopupForm({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', service: '', details: '',
  })
  const { submit, loading, success, reset } = useFormSubmit('/quote/')

  useScrollLock(isOpen)

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    submit({
      name: formData.name,
      email: formData.email || `${formData.phone}@placeholder.com`,
      phone: formData.phone,
      request_type: 'Free Quotation',
      project_type: formData.service,
      details: formData.details,
    })
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      reset()
      setFormData({ name: '', phone: '', email: '', service: '', details: '' })
    }, 300)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="popup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: .25 }}
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <motion.div
            className="popup"
            initial={{ opacity: 0, y: 30, scale: .96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: .96 }}
            transition={{ duration: .35, ease: [.4, 0, .2, 1] }}
          >
            <div className="popup-header">
              <span className="popup-free-tag">100% Free</span>
              <h3>Get Your Free Quotation</h3>
              <p>No hidden charges. No obligations. Just transparent pricing.</p>
              <button className="popup-close" onClick={handleClose} aria-label="Close">×</button>
            </div>

            <div className="popup-body">
              {success ? (
                <motion.div
                  className="popup-success"
                  initial={{ opacity: 0, scale: .8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: .4, ease: [.175, .885, .32, 1.275] }}
                >
                  <div className="popup-success-icon">✓</div>
                  <h4>Thank You!</h4>
                  <p>Our team will contact you within 2 hours with your free quotation.</p>
                  <button className="btn btn-navy btn-full" onClick={handleClose}>Done</button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input name="name" className="form-input" placeholder="Your name" required value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label>Phone *</label>
                      <input name="phone" className="form-input" placeholder="+91-XXXXX XXXXX" required value={formData.phone} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input name="email" type="email" className="form-input" placeholder="you@email.com" value={formData.email} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Service Needed *</label>
                    <select name="service" className="form-input" required value={formData.service} onChange={handleChange}>
                      <option value="">Select a service</option>
                      {SERVICES.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Project Details</label>
                    <textarea name="details" className="form-input" rows={3} placeholder="Tell us about your project — location, area, budget..." value={formData.details} onChange={handleChange} />
                  </div>
                  <button className="btn btn-gold btn-full btn-lg" type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit — Get Free Quote ✨'}
                  </button>
                  <p className="popup-privacy">🔒 Your data is secure. We never share your information.</p>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
