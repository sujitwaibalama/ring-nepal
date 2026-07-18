import { useState } from 'react'
import { ArrowRight, MapPin } from 'lucide-react'
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
    <section className="relative h-screen min-h-[640px] overflow-hidden bg-ink">
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
        className="relative z-10 flex h-full flex-col justify-center px-5 pb-14 pt-24 text-center will-change-transform md:px-8"
        style={{
          transform: `translate3d(0, ${contentY}px, 0)`,
          opacity: fade,
        }}
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-white/90 backdrop-blur-sm">
            <MapPin className="size-3 text-pink" />
            {hero.eyebrow}
          </p>

          <h1 className="leading-[1.05]">
            <span className="font-script block text-5xl text-white md:text-7xl lg:text-8xl">
              {hero.line1}
            </span>
            <span className="mt-2 block font-sans text-2xl font-medium tracking-tight text-gold-light md:mt-3 md:text-4xl lg:text-5xl">
              {hero.line2}
            </span>
          </h1>

          <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-white/80 md:text-base">
            {hero.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#showreel"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink-soft"
            >
              Shop looks
              <ArrowRight className="size-4" />
            </a>
            <a
              href={wa('Hi Ring Nepal, I want to shop!')}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              WhatsApp order
            </a>
          </div>

          <p className="mt-8 text-[10px] uppercase tracking-[0.35em] text-white/45">
            Estd {brand.estd} · {brand.nameNp}
          </p>
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
        style={{ opacity: fade }}
        aria-hidden
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">
          Scroll
        </span>
        <span className="h-8 w-px bg-gradient-to-b from-white/50 to-transparent" />
      </div>
    </section>
  )
}
