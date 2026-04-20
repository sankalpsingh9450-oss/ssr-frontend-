import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SITE } from '../../constants'

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#09111f] text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.16),transparent_24%),linear-gradient(135deg,rgba(26,37,64,0.96),rgba(9,17,31,0.94)),linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:auto,auto,72px_72px,72px_72px]"
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/[0.07] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-7"
        >
          <div className="rounded-[24px] border border-white/10 bg-[#0d1728]/90 p-5 sm:p-6">
            <Link
              to="/"
              className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:border-[#d4af37]/60 hover:text-white"
            >
              <img src={SITE.logo} alt="SSR Group Civil" className="h-10 w-10 rounded-full object-cover" />
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-white">SSR Group Civil</span>
                <span className="block text-xs uppercase tracking-[0.25em] text-[#d4af37]">{SITE.tagline}</span>
              </span>
            </Link>

            <div className="mt-6">
              <span className="inline-flex rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#f4d67a]">
                Secure Client Access
              </span>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-[2rem]">{title}</h1>
              <p className="mt-2 text-sm leading-6 text-white/65">{subtitle}</p>
            </div>

            <div className="mt-6">{children}</div>

            {footer ? <div className="mt-6 border-t border-white/10 pt-5 text-center text-sm text-white/60">{footer}</div> : null}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
