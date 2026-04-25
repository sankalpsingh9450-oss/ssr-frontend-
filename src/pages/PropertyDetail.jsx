import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import PropertyGallery from '../components/PropertyGallery'
import PropertyStickyContact from '../components/PropertyStickyContact'
import SiteVisitForm from '../components/SiteVisitForm'
import properties from '../properties'

const KEY_DETAILS = [
  { key: 'bhk', label: 'BHK' },
  { key: 'sqft', label: 'Sq Ft' },
  { key: 'location', label: 'Location' },
  { key: 'possessionDate', label: 'Possession' },
]

export default function PropertyDetail() {
  const { slug } = useParams()
  const property = useMemo(() => properties.find((item) => item.slug === slug), [slug])

  if (!property) {
    return (
      <section className="min-h-screen bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Property not found</h1>
          <p className="mt-3 text-sm text-slate-600">
            The property you are looking for is not available right now.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-white px-4 py-8 pb-24 sm:px-6 lg:px-8 lg:pb-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-8">
            <PropertyGallery title={property.title} images={property.images} />

            <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-3xl font-bold text-[#1a2540]">{property.price}</p>
                  <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">{property.title}</h1>
                  <p className="mt-3 text-base leading-7 text-slate-600">{property.description}</p>
                </div>
                <span className="inline-flex w-fit rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-amber-800">
                  {property.status}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">Key Details</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {KEY_DETAILS.map((item) => (
                  <div key={item.key} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d4af37]">{item.label}</p>
                    <p className="mt-3 text-lg font-semibold text-slate-900">{property[item.key]}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">Full Description</h2>
              <p className="mt-4 text-base leading-8 text-slate-600">{property.fullDescription}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">Amenities</h2>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {property.amenities.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#d4af37] text-xs font-bold text-[#1a2540]">
                      ✓
                    </span>
                    <span className="text-sm leading-6 text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">Location Map</h2>
              <div className="mt-5 flex min-h-[260px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center text-sm leading-7 text-slate-500">
                Interactive map placeholder. We can replace this with a live embed once the exact location/embed source is finalized.
              </div>
            </div>

            <div id="site-visit-form" className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d4af37]">Book a Visit</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Schedule a site visit</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Share your details and preferred visit date. We will coordinate the next steps for this property.
              </p>
              <div className="mt-6">
                <SiteVisitForm property={property} />
              </div>
            </div>
          </div>

          <PropertyStickyContact property={property} />
        </div>
      </div>
    </section>
  )
}
