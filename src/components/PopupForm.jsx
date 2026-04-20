import { motion, AnimatePresence } from 'framer-motion'
import { useScrollLock } from '../hooks'
import QuoteRequestForm from './forms/QuoteRequestForm'
import './PopupForm.css'

export default function PopupForm({ isOpen, onClose }) {
  useScrollLock(isOpen)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="popup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(event) => event.target === event.currentTarget && onClose()}
        >
          <motion.div
            className="popup"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="popup-header">
              <span className="popup-free-tag">100% Free</span>
              <h3>Get Your Free Quotation</h3>
              <p>No hidden charges. No obligations. Just transparent pricing and a proper validation flow.</p>
              <button className="popup-close" onClick={onClose} aria-label="Close">×</button>
            </div>

            <div className="popup-body">
              <QuoteRequestForm onSubmitted={onClose} onCloseLabel="Done" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
