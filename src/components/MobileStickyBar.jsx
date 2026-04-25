import { FiPhone } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { SITE, WHATSAPP_URL } from '../constants'

export default function MobileStickyBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-[#1a2540]/10 bg-[#d4af37] px-4 py-3 md:hidden">
      <div className="mx-auto flex max-w-7xl gap-3">
        <a
          href={`tel:${SITE.phoneRaw}`}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border border-[#1a2540] bg-[#d4af37] px-4 py-3 text-sm font-semibold text-[#1a2540] transition-colors duration-200 hover:bg-[#c9a42b]"
        >
          <FiPhone />
          Call
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border border-[#1a2540] bg-[#d4af37] px-4 py-3 text-sm font-semibold text-[#1a2540] transition-colors duration-200 hover:bg-[#c9a42b]"
        >
          <FaWhatsapp />
          WhatsApp
        </a>
      </div>
    </div>
  )
}
