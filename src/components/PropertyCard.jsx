import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { SITE } from '../constants'

export default function PropertyCard({ property, isSaved, onToggleSave }) {
  const encodedMessage = encodeURIComponent(`Hi, I am interested in this property:

Property ID: ${property.id}
${property.title}
Price: ${property.price}
Location: ${property.location}

Please share more details.`)

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative">
        <img src={property.imageUrl} alt={property.title} className="h-56 w-full object-cover" />
        <button
          type="button"
          onClick={() => onToggleSave(property.id)}
          className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#1a2540] shadow-md transition-colors duration-200 hover:bg-white"
          aria-label={isSaved ? `Remove ${property.title} from saved properties` : `Save ${property.title}`}
          aria-pressed={isSaved}
        >
          {isSaved ? <FaHeart className="text-[#d4af37]" /> : <FaRegHeart />}
        </button>
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <p className="text-2xl font-bold text-[#1a2540]">{property.price}</p>
          <h2 className="text-xl font-semibold text-slate-900">
            <Link to={`/properties/${property.slug}`} className="transition-colors duration-200 hover:text-[#1a2540]">
              {property.title}
            </Link>
          </h2>
          <p className="text-sm font-medium text-slate-500">{property.location}</p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
              {property.type}
            </span>
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
              {property.status}
            </span>
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
              {property.bhk}
            </span>
          </div>
        </div>

        <p className="text-sm leading-6 text-slate-600">{property.description}</p>

        <Link
          to={`/properties/${property.slug}`}
          className="inline-flex text-sm font-semibold text-[#1a2540] transition-colors duration-200 hover:text-[#d4af37]"
        >
          View Details
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={`tel:${SITE.phoneRaw}`}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md bg-[#1a2540] px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#24345b]"
          >
            Call
          </a>
          <a
            href={`https://wa.me/${SITE.phoneRaw}?text=${encodedMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md border border-[#1a2540] px-4 py-3 text-sm font-semibold text-[#1a2540] transition-colors duration-200 hover:bg-[#1a2540] hover:text-white"
          >
            Get Details
          </a>
        </div>
      </div>
    </article>
  )
}
