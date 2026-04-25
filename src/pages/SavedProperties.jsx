import { useEffect, useMemo, useState } from 'react'
import properties from '../properties'
import PropertyCard from '../components/PropertyCard'
import { getSavedPropertyIds, toggleSavedPropertyId } from '../lib/savedProperties'

export default function SavedProperties() {
  const [savedIds, setSavedIds] = useState([])

  useEffect(() => {
    const syncSavedIds = () => setSavedIds(getSavedPropertyIds())

    syncSavedIds()
    window.addEventListener('storage', syncSavedIds)
    return () => window.removeEventListener('storage', syncSavedIds)
  }, [])

  const savedProperties = useMemo(
    () => properties.filter((property) => savedIds.includes(property.id)),
    [savedIds]
  )

  const handleToggleSave = (id) => {
    setSavedIds(toggleSavedPropertyId(id))
  }

  return (
    <section className="min-h-screen bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Saved Properties</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
            Review the properties you have saved and continue exploring the best options for your needs.
          </p>
        </div>

        {savedProperties.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {savedProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isSaved={savedIds.includes(property.id)}
                onToggleSave={handleToggleSave}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <h2 className="text-2xl font-semibold text-[#1a2540]">No saved properties yet</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Tap the heart icon on any property card to save it here for quick access later.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
