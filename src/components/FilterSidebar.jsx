import { AnimatePresence, motion } from 'framer-motion'
import { FiSliders, FiX } from 'react-icons/fi'
import { getInputClass } from './forms/FormUi'

export default function FilterSidebar({
  isMobileOpen,
  onClose,
  filters,
  options,
  onBudgetMinChange,
  onBudgetMaxChange,
  onLocationChange,
  onBhkToggle,
  onTypeChange,
  onStatusChange,
  onClearAll,
}) {
  const panel = (
    <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:max-w-none lg:shadow-none">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d4af37]">Filters</p>
          <h2 className="mt-2 text-2xl font-bold text-[#1a2540]">Refine Properties</h2>
        </div>
        <button
          type="button"
          onClick={onClearAll}
          className="text-sm font-semibold text-[#1a2540] underline-offset-4 hover:text-[#d4af37] hover:underline"
        >
          Clear All
        </button>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Budget Range</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="range"
                min={options.budgetBounds.min}
                max={options.budgetBounds.max}
                step="5"
                value={filters.budgetMin}
                onChange={(event) => onBudgetMinChange(Number(event.target.value))}
                className="w-full accent-[#1a2540]"
              />
              <p className="mt-2 text-xs text-slate-500">Min: ₹{filters.budgetMin}L</p>
            </div>
            <div>
              <input
                type="range"
                min={options.budgetBounds.min}
                max={options.budgetBounds.max}
                step="5"
                value={filters.budgetMax}
                onChange={(event) => onBudgetMaxChange(Number(event.target.value))}
                className="w-full accent-[#1a2540]"
              />
              <p className="mt-2 text-xs text-slate-500">Max: ₹{filters.budgetMax}L</p>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="filter-location" className="mb-2 block text-sm font-medium text-slate-700">
            Location
          </label>
          <select
            id="filter-location"
            value={filters.location}
            onChange={(event) => onLocationChange(event.target.value)}
            className={getInputClass(false)}
          >
            <option value="">All locations</option>
            {options.locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-slate-700">BHK</span>
          <div className="grid gap-2">
            {options.bhkOptions.map((bhk) => (
              <label key={bhk} className="flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={filters.bhk.includes(bhk)}
                  onChange={() => onBhkToggle(bhk)}
                  className="h-4 w-4 rounded border-slate-300 text-[#1a2540] focus:ring-[#1a2540]"
                />
                <span>{bhk}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-slate-700">Property Type</span>
          <div className="grid gap-2">
            <label className="flex items-center gap-3 text-sm text-slate-700">
              <input
                type="radio"
                name="property-type"
                checked={!filters.type}
                onChange={() => onTypeChange('')}
                className="h-4 w-4 border-slate-300 text-[#1a2540] focus:ring-[#1a2540]"
              />
              <span>All types</span>
            </label>
            {options.types.map((type) => (
              <label key={type} className="flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="radio"
                  name="property-type"
                  checked={filters.type === type}
                  onChange={() => onTypeChange(type)}
                  className="h-4 w-4 border-slate-300 text-[#1a2540] focus:ring-[#1a2540]"
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-slate-700">Status</span>
          <div className="grid gap-2">
            <label className="flex items-center gap-3 text-sm text-slate-700">
              <input
                type="radio"
                name="property-status"
                checked={!filters.status}
                onChange={() => onStatusChange('')}
                className="h-4 w-4 border-slate-300 text-[#1a2540] focus:ring-[#1a2540]"
              />
              <span>All statuses</span>
            </label>
            {options.statuses.map((status) => (
              <label key={status} className="flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="radio"
                  name="property-status"
                  checked={filters.status === status}
                  onChange={() => onStatusChange(status)}
                  className="h-4 w-4 border-slate-300 text-[#1a2540] focus:ring-[#1a2540]"
                />
                <span>{status}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div className="hidden lg:block">{panel}</div>

      <AnimatePresence>
        {isMobileOpen ? (
          <motion.div
            className="fixed inset-0 z-50 flex justify-start bg-slate-950/50 px-4 py-4 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(event) => event.target === event.currentTarget && onClose()}
          >
            <motion.div
              initial={{ x: -32, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -32, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-sm"
            >
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close filters"
              >
                <FiX className="text-xl" />
              </button>
              {panel}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export function FilterButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#1a2540] px-4 py-3 text-sm font-semibold text-[#1a2540] transition-colors duration-200 hover:bg-[#1a2540] hover:text-white lg:hidden"
    >
      <FiSliders />
      Filters
    </button>
  )
}
