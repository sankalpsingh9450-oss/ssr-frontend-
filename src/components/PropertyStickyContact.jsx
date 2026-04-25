import { SITE } from '../constants'

export default function PropertyStickyContact({ property }) {
  const whatsappMessage = encodeURIComponent(`Hi, I am interested in this property:

Property ID: ${property.id}
${property.title}
Location: ${property.location}

Please share more details.`)

  return (
    <>
      <aside className="hidden lg:block lg:sticky lg:top-24">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d4af37]">Quick Connect</p>
          <h3 className="mt-3 text-2xl font-semibold text-slate-900">Interested in this property?</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Speak with our team right away or schedule a site visit using the buttons below.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <a
              href={`tel:${SITE.phoneRaw}`}
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#1a2540] px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#24345b]"
            >
              Call
            </a>
            <a
              href={`https://wa.me/${SITE.phoneRaw}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#1a2540] px-4 py-3 text-sm font-semibold text-[#1a2540] transition-colors duration-200 hover:bg-[#1a2540] hover:text-white"
            >
              WhatsApp
            </a>
            <a
              href="#site-visit-form"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#d4af37] px-4 py-3 text-sm font-semibold text-[#1a2540] transition-colors duration-200 hover:bg-[#c7a126]"
            >
              Site Visit
            </a>
          </div>
        </div>
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-[#1a2540]/10 bg-[#d4af37] md:hidden">
        <a
          href={`tel:${SITE.phoneRaw}`}
          className="inline-flex min-h-14 items-center justify-center border-r border-[#1a2540]/10 px-4 text-sm font-semibold text-[#1a2540]"
        >
          Call
        </a>
        <a
          href={`https://wa.me/${SITE.phoneRaw}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-14 items-center justify-center border-r border-[#1a2540]/10 px-4 text-sm font-semibold text-[#1a2540]"
        >
          WhatsApp
        </a>
        <a
          href="#site-visit-form"
          className="inline-flex min-h-14 items-center justify-center px-4 text-sm font-semibold text-[#1a2540]"
        >
          Site Visit
        </a>
      </div>
    </>
  )
}
