import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Login.css'

export default function NotFound() {
  return (
    <div className="login-page">
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .5 }}
        style={{ textAlign: 'center' }}
      >
        <div style={{ fontSize: 56, marginBottom: 16, lineHeight: 1 }}>🏗️</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 64, color: 'var(--gold-500)', marginBottom: 8 }}>404</h2>
        <p style={{ color: 'var(--gray-500)', fontSize: 16, marginBottom: 8 }}>Page Not Found</p>
        <p style={{ color: 'var(--gray-400)', fontSize: 14, marginBottom: 28 }}>
          Looks like this page is still under construction.
        </p>
        <Link to="/" className="btn btn-gold btn-full">← Back to Home</Link>
      </motion.div>
    </div>
  )
}
