import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#09111f,#1a2540)] px-6 py-10">
      <motion.div
        className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/[0.08] p-6 text-center text-white shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .5 }}
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
