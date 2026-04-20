const strengthColors = {
  Weak: 'bg-red-500',
  Good: 'bg-amber-400',
  Strong: 'bg-emerald-500',
}

export default function PasswordStrengthMeter({ password, strength }) {
  const activeColor = strengthColors[strength.label] || 'bg-slate-500'

  return (
    <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/50">Password strength</span>
        <span className="text-sm font-semibold text-white">{strength.label}</span>
      </div>

      <div className="mt-3 grid grid-cols-5 gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={`h-2 rounded-full ${index < strength.score ? activeColor : 'bg-white/10'}`}
            aria-hidden="true"
          />
        ))}
      </div>

      <ul className="mt-3 space-y-1 text-xs text-white/60">
        <li className={password.length >= 8 ? 'text-emerald-300' : ''}>At least 8 characters</li>
        <li className={/[A-Z]/.test(password) ? 'text-emerald-300' : ''}>One uppercase letter</li>
        <li className={/[a-z]/.test(password) ? 'text-emerald-300' : ''}>One lowercase letter</li>
        <li className={/\d/.test(password) ? 'text-emerald-300' : ''}>One number</li>
      </ul>
    </div>
  )
}
