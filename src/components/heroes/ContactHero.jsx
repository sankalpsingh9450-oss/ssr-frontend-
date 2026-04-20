import { SITE, WHATSAPP_URL } from '../../constants'
import BaseHero from './BaseHero'

export default function ContactHero() {
  return (
    <BaseHero
      title="Get In Touch"
      subtitle="Speak with the team about your next construction, civil, or real-estate requirement."
      description="Use the contact form, call directly, connect on WhatsApp, or review our office location and business hours before reaching out."
      actions={[
        { label: 'Open Contact Form', href: '#contact-form' },
        { label: 'WhatsApp Us', href: WHATSAPP_URL, variant: 'secondary', target: '_blank', rel: 'noopener noreferrer' },
      ]}
      backgroundImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80"
      scrollTarget="#hero-next"
      aside={
        <div className="ui-panel">
          <div className="grid gap-4">
            <div>
              <div className="section-heading__eyebrow">Quick Contact</div>
              <p className="text-sm text-[var(--color-text-muted)]">{SITE.phone}</p>
              <p className="text-sm text-[var(--color-text-muted)]">{SITE.email}</p>
              <p className="text-sm text-[var(--color-text-muted)]">{SITE.hours}</p>
            </div>
            <div className="rounded-[8px] overflow-hidden border border-[#e5e5e5]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.123!2d77.43!3d28.59!2m3!1f0!2f0!3f0!2m3!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM1JzI0LjAiTiA3N8KwMjUnNDguMCJF!5e0!3m2!1sen!2sin!4v1"
                loading="lazy"
                title="SSR Group office location"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[220px] w-full border-0"
              />
            </div>
          </div>
        </div>
      }
    />
  )
}
