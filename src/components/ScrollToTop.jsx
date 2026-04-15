import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './ScrollToTop.css'

export default function ScrollToTop() {
  const [show, setShow] = useState(false)
  const location = useLocation()

  // Auto scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  // Show button after scrolling 400px
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          className="scroll-top-btn"
          onClick={scrollUp}
          initial={{ opacity: 0, scale: .6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: .6 }}
          transition={{ duration: .25 }}
          aria-label="Scroll to top"
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  )
}
