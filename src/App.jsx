import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import TopBanner from './components/TopBanner'
import Footer from './components/Footer'
import FloatButtons from './components/FloatButtons'
import PopupForm from './components/PopupForm'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Services from './pages/Services'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: .3, ease: [.4, 0, .2, 1] },
}

function PageWrapper({ children }) {
  return (
    <motion.div {...pageTransition}>
      {children}
    </motion.div>
  )
}

export default function App() {
  const [showPopup, setShowPopup] = useState(false)
  const [autoPopupShown, setAutoPopupShown] = useState(false)
  const location = useLocation()

  // Auto popup after 10s on home (once per session)
  useEffect(() => {
    if (!autoPopupShown && location.pathname === '/') {
      const timer = setTimeout(() => {
        setShowPopup(true)
        setAutoPopupShown(true)
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [location.pathname, autoPopupShown])

  const openQuote = () => setShowPopup(true)
  const isAuthPage = location.pathname === '/login'

  if (isAuthPage) return <Login />

  return (
    <>
      <TopBanner onQuoteClick={openQuote} />
      <Navbar onQuoteClick={openQuote} />
      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><Home onQuoteClick={openQuote} /></PageWrapper>} />
            <Route path="/services" element={<PageWrapper><Services onQuoteClick={openQuote} /></PageWrapper>} />
            <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
            <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <FloatButtons />
      <ScrollToTop />
      <PopupForm isOpen={showPopup} onClose={() => setShowPopup(false)} />
    </>
  )
}
