import { useEffect, useRef } from 'react'
import { MessageCircle } from 'lucide-react'
import { useCatalog } from '../lib/CatalogContext'
import { buildOrderMessage } from '../lib/orderMessage'
import { useResolvedMedia } from '../lib/useResolvedMedia'

export function ProductShowreel() {
  const { catalog, wa } = useCatalog()
  const items = catalog.showreel

  if (!items.length) return null

  return (
    <section id="showreel" className="bg-white py-12 md:py-20">
      <div className="mx-auto mb-6 flex max-w-7xl items-end justify-between gap-4 px-4 sm:mb-8 sm:px-5 md:px-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-pink">
            Watch & shop
          </p>
          <h2 className="mt-2 font-script text-4xl text-ink md:text-5xl">
            See it sparkle
          </h2>
          <p className="mt-2 text-sm text-stone">
            Swipe sideways · order any look on WhatsApp
          </p>
        </div>
      </div>

      <div
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 pb-2 sm:gap-4 sm:px-5 md:gap-5 md:px-8 md:pb-4"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {items.map((p) => (
          <ShowreelCard
            key={p.id}
            src={p.src}
            name={p.name}
            tag={p.tag}
            price={p.price}
            waHref={wa(
              buildOrderMessage({
                name: p.name,
                price: p.price,
                // Public video/path URL so staff can open media (idb uploads: site fallback note)
                image:
                  p.src.startsWith('/') ||
                  p.src.startsWith('http://') ||
                  p.src.startsWith('https://')
                    ? p.src
                    : undefined,
              }),
            )}
          />
        ))}
        <div className="w-2 shrink-0" aria-hidden />
      </div>
    </section>
  )
}

function ShowreelCard({
  src,
  name,
  tag,
  price,
  waHref,
}: {
  src: string
  name: string
  tag: string
  price: string
  waHref: string
}) {
  const ref = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaUrl = useResolvedMedia(src)

  useEffect(() => {
    const el = ref.current
    const v = videoRef.current
    if (!el || !v || !mediaUrl) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
          void v.play().catch(() => {})
        } else {
          v.pause()
        }
      },
      { threshold: [0, 0.55, 0.85] },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [mediaUrl])

  return (
    <article
      ref={ref}
      className="card-lift relative w-[72vw] max-w-[300px] shrink-0 snap-center overflow-hidden rounded-[1.5rem] bg-mist shadow-sm ring-1 ring-line sm:w-[300px] sm:rounded-[1.75rem] md:w-[340px]"
    >
      <div className="relative aspect-[3/4]">
        {mediaUrl ? (
          <video
            ref={videoRef}
            src={mediaUrl}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-mist" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-pink">
            {tag}
          </p>
          <h3 className="mt-1 text-lg font-medium text-white sm:text-xl">{name}</h3>
          <div className="mt-3 flex items-center justify-between gap-3 sm:mt-4">
            <p className="text-sm font-semibold text-white/95">{price}</p>
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className="pressable inline-flex min-h-10 items-center gap-1.5 rounded-full bg-ink px-3.5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white hover:bg-ink-soft"
            >
              <MessageCircle className="size-3.5" />
              Order
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}
