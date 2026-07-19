import { useState } from 'react'
import { ArrowRight, ChevronDown, MapPin } from 'lucide-react'
import { useCatalog } from '../lib/CatalogContext'
import { useScrollY } from '../hooks/useParallax'

export function Hero() {
  const { catalog, wa } = useCatalog()
  const { brand, hero } = catalog
  const [videoReady, setVideoReady] = useState(false)
  const scrollY = useScrollY()

  const vh = typeof window !== 'undefined' ? window.innerHeight : 800
  const bgY = Math.min(scrollY, vh) * 0.45
  const midY = Math.min(scrollY, vh) * 0.2
  const contentY = Math.min(scrollY, vh) * 0.12
  const fade = Math.max(0, 1 - scrollY / (vh * 0.8))

  return (
    <section className="relative h-[100svh] min-h-[560px] max-h-[900px] overflow-hidden bg-ink md:min-h-[640px] md:max-h-none md:h-screen">
      <div
        className="absolute inset-0 z-0 will-change-transform"
        style={{ transform: `translate3d(0, ${bgY}px, 0) scale(1.15)` }}
      >
        <video
          src={hero.video}
          poster={hero.poster}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          onCanPlay={() => setVideoReady(true)}
          onError={() => setVideoReady(false)}
        />
        {!videoReady && (
          <img
            src={hero.poster}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </div>

      <div
        className="absolute inset-0 z-[1] will-change-transform"
        style={{ transform: `translate3d(0, ${midY}px, 0)` }}
        aria-hidden
      >
        <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/25 to-ink/75" />
        <div className="pointer-events-none absolute -left-24 top-1/3 h-64 w-64 rounded-full bg-pink/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-1/4 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
      </div>

      <div
        className="relative z-10 flex h-full flex-col justify-center px-4 pb-20 pt-24 text-center will-change-transform sm:px-5 md:px-8 md:pb-14"
        style={{
          transform: `translate3d(0, ${contentY}px, 0)`,
          opacity: fade,
          paddingTop: 'max(6rem, calc(env(safe-area-inset-top, 0px) + 5rem))',
        }}
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <p className="hero-enter hero-enter-delay-1 mb-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-white/90 backdrop-blur-sm sm:mb-4 sm:px-4 sm:text-[11px] sm:tracking-[0.28em]">
            <MapPin className="size-3 shrink-0 text-pink" />
            <span className="line-clamp-1">{hero.eyebrow}</span>
          </p>

          <h1 className="hero-enter hero-enter-delay-2 leading-[1.05]">
            <span className="font-script block text-[2.75rem] text-white sm:text-5xl md:text-7xl lg:text-8xl">
              {hero.line1}
            </span>
            <span className="mt-1.5 block font-sans text-xl font-medium tracking-tight text-gold-light sm:mt-2 sm:text-2xl md:mt-3 md:text-4xl lg:text-5xl">
              {hero.line2}
            </span>
          </h1>

          <p className="hero-enter hero-enter-delay-3 mt-4 max-w-md px-1 text-sm font-light leading-relaxed text-white/80 sm:mt-5 md:text-base">
            {hero.subtitle}
          </p>

          <div className="hero-enter hero-enter-delay-4 mt-7 flex w-full max-w-sm flex-col items-stretch gap-2.5 sm:mt-8 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
            <a
              href="#showreel"
              className="pressable inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/25 hover:bg-ink-soft"
            >
              Shop looks
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
            <a
              href={wa('Hi Ring Nepal, I want to shop!')}
              target="_blank"
              rel="noreferrer"
              className="pressable inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/20"
            >
              WhatsApp order
            </a>
          </div>

          <p className="hero-enter hero-enter-delay-5 mt-6 text-[10px] uppercase tracking-[0.3em] text-white/45 sm:mt-8 sm:tracking-[0.35em]">
            Estd {brand.estd} · {brand.nameNp}
          </p>
        </div>
      </div>

      <a
        href="#showreel"
        className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-white/55 transition-opacity duration-300 hover:text-white/80 sm:bottom-8"
        style={{
          opacity: fade,
          marginBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
        aria-label="Scroll to shop"
      >
        <span className="hidden text-[10px] uppercase tracking-[0.3em] md:inline">
          Scroll
        </span>
        <ChevronDown className="size-5 animate-bounce md:hidden" />
        <span className="hidden h-8 w-px bg-gradient-to-b from-white/50 to-transparent md:block" />
      </a>
    </section>
  )
}
