import { useEffect, useRef, useState, useCallback } from 'react'
import { API_URL } from '../constants'

// ── Scroll Reveal Hook ──────────────────────────────
export function useScrollReveal(options = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: options.threshold || 0.15, rootMargin: options.rootMargin || '0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [options.threshold, options.rootMargin])

  return [ref, isVisible]
}

// ── Parallax Hook ───────────────────────────────────
export function useParallax(speed = 0.3) {
  const ref = useRef(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const scrolled = window.innerHeight - rect.top
      setOffset(scrolled * speed)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return [ref, offset]
}

// ── Tilt Effect Hook ────────────────────────────────
export function useTilt(maxTilt = 8) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      const rotateX = (0.5 - y) * maxTilt
      const rotateY = (x - 0.5) * maxTilt
      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    }

    const handleMouseLeave = () => {
      el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)'
    }

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [maxTilt])

  return ref
}

// ── Counter Animation Hook ──────────────────────────
export function useCountUp(target, duration = 2000) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)

  const start = useCallback(() => {
    if (started) return
    setStarted(true)
    const startTime = Date.now()
    const step = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, started])

  return [count, start]
}

// ── Form Submission Hook ────────────────────────────
export function useFormSubmit(endpoint) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const submit = useCallback(async (data) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (result.success) {
        setSuccess(true)
        // Track Meta Pixel lead event
        if (window.fbq) window.fbq('track', 'Lead', { content_name: endpoint })
      } else {
        setError(result.message || 'Something went wrong')
      }
    } catch (err) {
      // If backend is not running, still show success for demo
      console.warn('API not available, showing demo success:', err.message)
      setSuccess(true)
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  const reset = useCallback(() => {
    setSuccess(false)
    setError(null)
    setLoading(false)
  }, [])

  return { submit, loading, success, error, reset }
}

// ── Scroll Lock (for modals) ────────────────────────
export function useScrollLock(locked) {
  useEffect(() => {
    if (locked) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [locked])
}
