import { useEffect, useRef, useState, type ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  className?: string
  /** Stagger delay in ms */
  delay?: number
}

/** Calm fade/rise when content enters view — premium, not flashy */
export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setShown(true)
      return
    }

    // Already in view on load (above fold) → show quickly
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      // Tiny delay so first paint feels intentional
      const t = window.setTimeout(() => setShown(true), Math.min(delay, 80))
      return () => window.clearTimeout(t)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={`reveal ${shown ? 'reveal-in' : ''} ${className}`}
      style={{ transitionDelay: shown ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}
