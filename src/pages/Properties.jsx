import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import PropertiesScrollPopup from '../components/PropertiesScrollPopup'
import FilterSidebar, { FilterButton } from '../components/FilterSidebar'
import PropertyCard from '../components/PropertyCard'
import properties from '../properties'
import { FieldError, getInputClass } from '../components/forms/FormUi'
import { formApi } from '../lib/formApi'
import { propertyLeadSchema } from '../lib/formSchemas'
import { getSavedPropertyIds, toggleSavedPropertyId } from '../lib/savedProperties'

const DEFAULT_SORT = 'newest'

function getBudgetBounds() {
  const values = properties.map((property) => property.priceValue)
  return {
    min: Math.min(...values),
    max: Math.max(...values),
  }
}

function sortProperties(items, sort) {
  const next = [...items]

  if (sort === 'price-asc') {
    return next.sort((a, b) => a.priceValue - b.priceValue)
  }

  if (sort === 'price-desc') {
    return next.sort((a, b) => b.priceValue - a.priceValue)
  }

  return next.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [savedIds, setSavedIds] = useState([])

  useEffect(() => {
    setSavedIds(getSavedPropertyIds())
  }, [])

  const budgetBounds = useMemo(() => getBudgetBounds(), [])
  const locations = useMemo(() => [...new Set(properties.map((property) => property.location))], [])
  const bhkOptions = useMemo(() => [...new Set(properties.map((property) => property.bhk))], [])
  const typeOptions = useMemo(() => [...new Set(properties.map((property) => property.type))], [])
  const statusOptions = useMemo(() => [...new Set(properties.map((property) => property.status))], [])

  const filters = {
    budgetMin: Number(searchParams.get('budgetMin') || budgetBounds.min),
    budgetMax: Number(searchParams.get('budgetMax') || budgetBounds.max),
    location: searchParams.get('location') || '',
    bhk: searchParams.getAll('bhk'),
    type: searchParams.get('type') || '',
    status: searchParams.get('status') || '',
    sort: searchParams.get('sort') || DEFAULT_SORT,
  }

  const filteredProperties = useMemo(() => {
    const next = properties.filter((property) => {
      const withinBudget =
        property.priceValue >= Math.min(filters.budgetMin, filters.budgetMax) &&
        property.priceValue <= Math.max(filters.budgetMin, filters.budgetMax)
      const matchesLocation = !filters.location || property.location === filters.location
      const matchesBhk = !filters.bhk.length || filters.bhk.includes(property.bhk)
      const matchesType = !filters.type || property.type === filters.type
      const matchesStatus = !filters.status || property.status === filters.status

      return withinBudget && matchesLocation && matchesBhk && matchesType && matchesStatus
    })

    return sortProperties(next, filters.sort)
  }, [filters])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(propertyLeadSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      budget: '',
    },
  })

  const updateParams = (updater) => {
    const next = new URLSearchParams(searchParams)
    updater(next)
    setSearchParams(next)
  }

  const onBudgetMinChange = (value) => {
    updateParams((params) => {
      params.set('budgetMin', String(value))
    })
  }

  const onBudgetMaxChange = (value) => {
    updateParams((params) => {
      params.set('budgetMax', String(value))
    })
  }

  const onLocationChange = (value) => {
    updateParams((params) => {
      if (value) params.set('location', value)
      else params.delete('location')
    })
  }

  const onBhkToggle = (value) => {
    updateParams((params) => {
      const current = new Set(params.getAll('bhk'))
      if (current.has(value)) current.delete(value)
      else current.add(value)
      params.delete('bhk')
      Array.from(current).forEach((item) => params.append('bhk', item))
    })
  }

  const onTypeChange = (value) => {
    updateParams((params) => {
      if (value) params.set('type', value)
      else params.delete('type')
    })
  }

  const onStatusChange = (value) => {
    updateParams((params) => {
      if (value) params.set('status', value)
      else params.delete('status')
    })
  }

  const onSortChange = (value) => {
    updateParams((params) => {
      if (value && value !== DEFAULT_SORT) params.set('sort', value)
      else params.delete('sort')
    })
  }

  const onClearAll = () => {
    setSearchParams(new URLSearchParams())
    setIsFilterOpen(false)
  }

  const onSubmit = async (values) => {
    await formApi.submitPropertyLead({
      ...values,
      source: 'properties_page',
    })
    toast.success('We will contact you shortly')
    reset()
  }

  const handleToggleSave = (id) => {
    setSavedIds(toggleSavedPropertyId(id))
  }

  return (
    <section className="min-h-screen bg-white px-4 py-16 sm:px-6 lg:px-8">
      <PropertiesScrollPopup />

      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Available Properties</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
            Explore a curated selection of residential, commercial, and investment-ready properties across Delhi NCR.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
          <FilterSidebar
            isMobileOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            filters={filters}
            options={{
              budgetBounds,
              locations,
              bhkOptions,
              types: typeOptions,
              statuses: statusOptions,
            }}
            onBudgetMinChange={onBudgetMinChange}
            onBudgetMaxChange={onBudgetMaxChange}
            onLocationChange={onLocationChange}
            onBhkToggle={onBhkToggle}
            onTypeChange={onTypeChange}
            onStatusChange={onStatusChange}
            onClearAll={onClearAll}
          />

          <div>
            <div className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#d4af37]">Results</p>
                <h2 className="mt-2 text-2xl font-bold text-[#1a2540]">{filteredProperties.length} properties found</h2>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <FilterButton onClick={() => setIsFilterOpen(true)} />
                <div className="min-w-[220px]">
                  <label htmlFor="properties-sort" className="mb-2 block text-sm font-medium text-slate-700">
                    Sort By
                  </label>
                  <select
                    id="properties-sort"
                    value={filters.sort}
                    onChange={(event) => onSortChange(event.target.value)}
                    className={getInputClass(false)}
                  >
                    <option value="price-asc">Price: Low-High</option>
                    <option value="price-desc">Price: High-Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>
            </div>

            {filteredProperties.length ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProperties.map((property) => (
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
                <h3 className="text-2xl font-semibold text-[#1a2540]">No properties match these filters</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Try widening your budget range or clearing one or two filters to see more options.
                </p>
                <button type="button" onClick={onClearAll} className="ui-btn ui-btn-primary mt-6">
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-14 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Interested in a property?</h2>
            <p className="mt-2 text-sm text-slate-600">
              Share your details and budget range. Our team will contact you with suitable options.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="property-lead-name" className="mb-2 block text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                id="property-lead-name"
                {...register('name')}
                className={getInputClass(errors.name)}
                placeholder="Your name"
                aria-invalid={Boolean(errors.name)}
              />
              <FieldError message={errors.name?.message} id="property-lead-name-error" />
            </div>

            <div>
              <label htmlFor="property-lead-phone" className="mb-2 block text-sm font-medium text-slate-700">
                Phone
              </label>
              <input
                id="property-lead-phone"
                {...register('phone')}
                className={getInputClass(errors.phone)}
                placeholder="10 digit phone number"
                aria-invalid={Boolean(errors.phone)}
              />
              <FieldError message={errors.phone?.message} id="property-lead-phone-error" />
            </div>

            <div>
              <label htmlFor="property-lead-budget" className="mb-2 block text-sm font-medium text-slate-700">
                Budget
              </label>
              <select
                id="property-lead-budget"
                {...register('budget')}
                className={getInputClass(errors.budget)}
                aria-invalid={Boolean(errors.budget)}
              >
                <option value="">Select budget</option>
                <option value="50L-1Cr">50L-1Cr</option>
                <option value="1Cr-3Cr">1Cr-3Cr</option>
                <option value="3Cr-5Cr">3Cr-5Cr</option>
              </select>
              <FieldError message={errors.budget?.message} id="property-lead-budget-error" />
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#1a2540] px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#24345b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
