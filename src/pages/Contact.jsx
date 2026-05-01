import { FiMail, FiMapPin, FiMessageCircle, FiPhoneCall } from 'react-icons/fi'
import { SITE, WHATSAPP_URL } from '../constants'
import ContactHero from '../components/heroes/ContactHero'
import ContactInquiryForm from '../components/forms/ContactInquiryForm'
import SectionHeading from '../components/ui/SectionHeading'

const CONTACT_OPTIONS = [
  {
    title: 'Call Us',
    value: SITE.phone,
    href: `tel:${SITE.phoneRaw}`,
    icon: FiPhoneCall,
    description: 'Best for urgent project conversations and quick guidance.',
  },
  {
    title: 'WhatsApp',
    value: 'Chat on WhatsApp',
    href: WHATSAPP_URL,
    icon: FiMessageCircle,
    description: 'Fastest option for site updates, documents, and quick queries.',
  },
  {
    title: 'Email',
    value: SITE.email,
    href: `mailto:${SITE.email}`,
    icon: FiMail,
    description: 'Use email when you want to share a detailed brief or attachments.',
  },
  {
    title: 'Office',
    value: SITE.address,
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.address)}`,
    icon: FiMapPin,
    description: 'Visit or navigate to our Greater Noida West office location.',
  },
]

const CONTACT_FAQS = [
  {
    question: 'How quickly does your team respond?',
    answer: 'We aim to respond to most new enquiries within working hours on the same day, especially for phone and WhatsApp requests.',
  },
  {
    question: 'Can I contact you before finalizing my budget?',
    answer: 'Yes. Many clients reach out early for planning guidance, rough budgeting, and advice on the right next step.',
  },
  {
    question: 'Do you handle both residential and commercial enquiries?',
    answer: 'Yes. We support construction, interiors, property search, investment advisory, and material-related conversations across multiple project types.',
  },
]

export default function Contact() {
  return (
    <>
      <ContactHero />

      <section className="section" id="hero-next">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-6">
              <div className="ui-contact-card">
                <SectionHeading
                  eyebrow="Contact Options"
                  title="Choose the fastest way to reach the SSR Group Civil team."
                  description="Use the option that fits your urgency and intent. For detailed project discussions, fill out the smart enquiry form."
                  align="left"
                />
                <div className="mt-6 grid gap-4">
                  {CONTACT_OPTIONS.map((option) => {
                    const Icon = option.icon

                    return (
                      <a
                        key={option.title}
                        href={option.href}
                        target={option.title === 'WhatsApp' || option.title === 'Office' ? '_blank' : undefined}
                        rel={option.title === 'WhatsApp' || option.title === 'Office' ? 'noopener noreferrer' : undefined}
                        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div className="flex items-start gap-4">
                          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#1a2540] text-white">
                            <Icon />
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#d4af37]">{option.title}</p>
                            <p className="mt-2 text-base font-semibold text-slate-900">{option.value}</p>
                            <p className="mt-2 text-sm leading-7 text-slate-600">{option.description}</p>
                          </div>
                        </div>
                      </a>
                    )
                  })}
                </div>
                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#d4af37]">Office Hours</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{SITE.hours}</p>
                  <p className="mt-1 text-sm leading-7 text-slate-600">Primary contact: {SITE.founder}</p>
                </div>
              </div>
            </div>

            <div className="ui-form-card contact-form-shell" id="contact-form">
              <h3 className="text-[24px] text-[var(--color-primary)]">Smart Contact Form</h3>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                Choose your intent first so the form adapts to construction, property, investment, or general enquiries.
              </p>
              <div className="mt-6">
                <ContactInquiryForm />
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
              <SectionHeading
                eyebrow="FAQ"
                title="Common questions before you contact us"
                description="A few quick answers to help you choose the right channel and tell us what you need."
                align="left"
              />
              <div className="mt-6 space-y-4">
                {CONTACT_FAQS.map((item) => (
                  <div key={item.question} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="text-lg font-semibold text-slate-900">{item.question}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
              <SectionHeading
                eyebrow="Office Map"
                title="Visit our Greater Noida West office"
                description="SSR Group Civil operates from Apex Aura Society, Sector 1, Greater Noida West, making it easy for clients across Noida Extension and Delhi NCR to connect with the team."
                align="left"
              />
              <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
                <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#d4af37]">Office Address</p>
                  <h3 className="mt-3 max-w-xl text-2xl font-bold text-[#1a2540]">
                    E/207 Apex Aura Society, Sector 1, Greater Noida West
                  </h3>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                    Use this location for office visits, project meetings, and in-person discussions with the SSR Group Civil team.
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-[#1a2540] px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#24345b]"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
