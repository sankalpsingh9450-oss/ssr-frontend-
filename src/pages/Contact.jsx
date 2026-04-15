import { useState } from 'react'
import { SITE, WHATSAPP_URL, CONTACT_SUBJECTS } from '../constants'
import { useScrollReveal, useFormSubmit } from '../hooks'
import './Contact.css'
import './Services.css'

export default function Contact() {
  const [ref, vis] = useScrollReveal()
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const { submit, loading, success, reset } = useFormSubmit('/contact/')

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }))
  const handleSubmit = (e) => {
    e.preventDefault()
    submit(formData)
  }

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero-content">
          <div className="section-label">Get In Touch</div>
          <h1>Contact Us</h1>
          <p>Whether you're planning a project, searching for property, or need materials — we're here for you.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div ref={ref} className={`contact-grid reveal ${vis ? 'visible' : ''}`}>
            {/* Info Card */}
            <div className="contact-info-card">
              <h3>Contact Information</h3>
              <p className="contact-info-sub">Reach out to us through any of these channels.</p>
              {[
                { icon: '👤', label: 'Contact Person', value: SITE.founder },
                { icon: '📧', label: 'Email', value: SITE.email },
                { icon: '📞', label: 'Phone', value: SITE.phone },
                { icon: '📍', label: 'Office', value: SITE.address },
                { icon: '🕐', label: 'Hours', value: SITE.hours },
              ].map((item, i) => (
                <div className="contact-info-item" key={i}>
                  <div className="contact-info-icon">{item.icon}</div>
                  <div>
                    <div className="contact-info-label">{item.label}</div>
                    <div className="contact-info-value">{item.value}</div>
                  </div>
                </div>
              ))}
              <a className="btn btn-gold btn-full" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={{ marginTop: 16 }}>
                💬 Chat on WhatsApp
              </a>
            </div>

            {/* Form */}
            <div className="contact-form-card">
              {success ? (
                <div className="contact-success">
                  <div className="contact-success-icon">✓</div>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. We'll get back to you within 2 hours.</p>
                  <button className="btn btn-navy" onClick={reset}>Send Another</button>
                </div>
              ) : (
                <>
                  <h3>Send a Message</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Full Name *</label>
                        <input name="name" className="form-input" placeholder="Your full name" required value={formData.name} onChange={handleChange} />
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
                      <label>Subject *</label>
                      <select name="subject" className="form-input" required value={formData.subject} onChange={handleChange}>
                        <option value="">Select subject</option>
                        {CONTACT_SUBJECTS.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Message *</label>
                      <textarea name="message" className="form-input" rows={5} placeholder="Tell us how we can help..." required value={formData.message} onChange={handleChange} />
                    </div>
                    <button className="btn btn-blue btn-full" type="submit" disabled={loading}>
                      {loading ? 'Sending...' : 'Send Message →'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="contact-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.123!2d77.43!3d28.59!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM1JzI0LjAiTiA3N8KwMjUnNDguMCJF!5e0!3m2!1sen!2sin!4v1"
              width="100%"
              height="320"
              style={{ border: 0 }}
              loading="lazy"
              title="SSR Group Location"
            />
          </div>
        </div>
      </section>
    </>
  )
}
