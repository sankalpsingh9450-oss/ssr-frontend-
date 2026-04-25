import { Suspense, lazy, useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import MobileStickyBar from './components/MobileStickyBar'

const ChatbotWidget = lazy(() => import('./components/ChatbotWidget'))
const PopupForm = lazy(() => import('./components/PopupForm'))
const Home = lazy(() => import('./pages/Home'))
const Services = lazy(() => import('./pages/Services'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'))
const Properties = lazy(() => import('./pages/Properties'))
const PropertyDetail = lazy(() => import('./pages/PropertyDetail'))
const SavedProperties = lazy(() => import('./pages/SavedProperties'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const Profile = lazy(() => import('./pages/Profile'))
const NotFound = lazy(() => import('./pages/NotFound'))

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

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center px-4 py-20 text-center text-slate-500">
      <div>
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-[#d4af37]" />
        <p className="mt-4 text-sm font-medium">Loading page...</p>
      </div>
    </div>
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
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname)

  if (isAuthPage) {
    return (
      <>
        <Toaster
          position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1a2540',
            color: '#ffffff',
            border: '1px solid rgba(212, 175, 55, 0.24)',
            borderRadius: '4px',
          },
        }}
      />
        <Suspense fallback={<RouteFallback />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
              <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
              <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </>
    )
  }

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1a2540',
            color: '#ffffff',
            border: '1px solid rgba(212, 175, 55, 0.24)',
            borderRadius: '4px',
          },
        }}
      />
      <Navbar onQuoteClick={openQuote} />
      <main className="pb-24 md:pb-0">
        <Suspense fallback={<RouteFallback />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageWrapper><Home onQuoteClick={openQuote} /></PageWrapper>} />
              <Route path="/services" element={<PageWrapper><Services onQuoteClick={openQuote} /></PageWrapper>} />
              <Route path="/services/:slug" element={<PageWrapper><ServiceDetail /></PageWrapper>} />
              <Route path="/properties" element={<PageWrapper><Properties /></PageWrapper>} />
              <Route path="/properties/:slug" element={<PageWrapper><PropertyDetail /></PageWrapper>} />
              <Route path="/saved-properties" element={<PageWrapper><SavedProperties /></PageWrapper>} />
              <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
              <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
              <Route path="/profile/*" element={<PageWrapper><Profile /></PageWrapper>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      <Footer />
      <MobileStickyBar />
      <Suspense fallback={null}>
        <ChatbotWidget onQuoteClick={openQuote} />
      </Suspense>
      <ScrollToTop />
      <Suspense fallback={null}>
        <PopupForm isOpen={showPopup} onClose={() => setShowPopup(false)} />
      </Suspense>
    </>
  )
}
