import { SITE, WHATSAPP_URL } from '../constants'
import ContactHero from '../components/heroes/ContactHero'
import ContactInquiryForm from '../components/forms/ContactInquiryForm'
import BusinessInquiryForm from '../components/forms/BusinessInquiryForm'
import SectionHeading from '../components/ui/SectionHeading'

export default function Contact() {
  return (
    <>
      <ContactHero />

      <section className="section" id="hero-next">
        <div className="container">
          <div className="site-grid-2">
            <div className="ui-contact-card">
              <SectionHeading
                eyebrow="Contact Details"
                title="Reach us through the right channel"
                description="For urgent project enquiries, WhatsApp and phone are the fastest routes. For detailed briefs, use the form."
                align="left"
              />
              <div className="mt-6 space-y-3 text-sm text-[var(--color-text-muted)]">
                <p><strong className="text-[var(--color-primary)]">Contact Person:</strong> {SITE.founder}</p>
                <p><strong className="text-[var(--color-primary)]">Phone:</strong> {SITE.phone}</p>
                <p><strong className="text-[var(--color-primary)]">Email:</strong> {SITE.email}</p>
                <p><strong className="text-[var(--color-primary)]">Office:</strong> {SITE.address}</p>
                <p><strong className="text-[var(--color-primary)]">Hours:</strong> {SITE.hours}</p>
              </div>
              <div className="mt-6">
                <a className="ui-btn ui-btn-primary" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              </div>
            </div>

            <div className="ui-form-card" id="contact-form">
              <h3 className="text-[24px] text-[var(--color-primary)]">Contact Form</h3>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">Share your enquiry and our team will respond with the right next step.</p>
              <div className="mt-6">
                <ContactInquiryForm />
              </div>
            </div>
          </div>

          <div className="mt-8 responsive-video">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.123!2d77.43!3d28.59!2m3!1f0!2f0!3f0!2m3!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM1JzI0LjAiTiA3N8KwMjUnNDguMCJF!5e0!3m2!1sen!2sin!4v1"
              loading="lazy"
              title="SSR Group office location"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="mt-8 ui-form-card">
            <h3 className="text-[24px] text-[var(--color-primary)]">Business & Partner Enquiries</h3>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">Use this section for company partnerships, vendor proposals, or business-level conversations.</p>
            <div className="mt-6">
              <BusinessInquiryForm />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
