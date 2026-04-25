import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiMinus, FiPlus } from 'react-icons/fi'

export default function FaqAccordion({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(0)

  if (!items.length) return null

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = index === openIndex

        return (
          <div key={item.question} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="flex min-h-11 w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-base font-semibold text-slate-900">{item.question}</span>
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[#1a2540]">
                {isOpen ? <FiMinus className="text-lg" /> : <FiPlus className="text-lg" />}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-slate-200 px-5 py-4 text-sm leading-7 text-slate-600">
                    {item.answer}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
