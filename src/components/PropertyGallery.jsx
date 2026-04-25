import { useState } from 'react'

export default function PropertyGallery({ title, images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const safeImages = images.length ? images : ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80']
  const activeImage = safeImages[activeIndex] || safeImages[0]

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <img src={activeImage} alt={title} className="h-[320px] w-full object-cover sm:h-[420px]" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {safeImages.map((image, index) => {
          const isActive = index === activeIndex

          return (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`overflow-hidden rounded-lg border transition-all duration-200 ${
                isActive ? 'border-[#d4af37] shadow-md' : 'border-slate-200 hover:border-slate-300'
              }`}
              aria-label={`View image ${index + 1} for ${title}`}
            >
              <img src={image} alt="" className="h-24 w-full object-cover sm:h-28" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
