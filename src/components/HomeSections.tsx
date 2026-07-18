import { useMemo, useState } from 'react'
import {
  Check,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import type { Product } from '../data/types'
import { getStockStatus } from '../data/types'
import { useCatalog } from '../lib/CatalogContext'
import {
  buildOrderMessage,
  buildStoreVisitMessage,
} from '../lib/orderMessage'
import { CategoryCard } from './CategoryCard'
import { ProductQuickView } from './ProductQuickView'
import { ProductShowreel } from './ProductShowreel'
import { ResolvedCover } from './ResolvedMedia'
import { Reveal } from './Reveal'
import { StockBadge } from './StockBadge'

export function HomeSections() {
  const { catalog, products, wa } = useCatalog()
  const { brand, categories, stores, orderSteps } = catalog
  const showStock = brand.showStockOnSite !== false

  const [category, setCategory] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [quickView, setQuickView] = useState<Product | null>(null)

  const categoryNames = useMemo(() => {
    const fromCats = categories.map((c) => c.name)
    const fromProducts = products.map((p) => p.meta).filter(Boolean)
    return Array.from(new Set([...fromCats, ...fromProducts]))
  }, [categories, products])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      if (category) {
        // Exact category match only (word-level).
        // Never use substring includes — "earrings" contains "rings" and mixed results.
        const cat = category.trim().toLowerCase()
        const meta = p.meta.trim().toLowerCase()
        const catFirst = cat.split(/[\s&/,+]+/).filter(Boolean)[0] ?? cat
        const metaFirst = meta.split(/[\s&/,+]+/).filter(Boolean)[0] ?? meta
        const match =
          meta === cat ||
          // e.g. "Bracelets" ↔ "Bracelets & more" (same first word, full word only)
          (catFirst.length >= 3 && metaFirst === catFirst)
        if (!match) return false
      }
      if (!q) return true
      return (
        p.name.toLowerCase().includes(q) ||
        p.meta.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        p.price.toLowerCase().includes(q)
      )
    })
  }, [products, category, query])

  function selectCategory(name: string | null) {
    setCategory(name)
    document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })
  }

  const newArrivals = useMemo(
    () => products.filter((p) => p.isNew),
    [products],
  )

  return (
    <>
      <ProductShowreel />

      <div className="border-y border-line bg-blush px-5 py-5 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm text-ink-soft">{brand.deliveryNote}</p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/70">
            <span className="rounded-full bg-white px-3 py-1 shadow-sm">
              {brand.storeCount} stores
            </span>
            <span className="rounded-full bg-white px-3 py-1 shadow-sm">
              WhatsApp order
            </span>
            <span className="rounded-full bg-white px-3 py-1 shadow-sm">
              COD available
            </span>
          </div>
        </div>
      </div>

      {/* New arrivals — digital window for drops (vs Instagram grid limits) */}
      {newArrivals.length > 0 && (
        <section id="new" className="bg-ink px-5 py-14 text-white md:px-8 md:py-16">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <div className="mb-8 flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
                <div>
                  <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-pink">
                    <Sparkles className="size-3.5" />
                    Just arrived
                  </p>
                  <h2 className="mt-2 font-script text-4xl text-white md:text-5xl">
                    What’s new this week
                  </h2>
                  <p className="mt-2 max-w-lg text-sm text-white/65">
                    Fresh pieces without walking to the store or scrolling endless
                    Instagram posts. Tap to order on WhatsApp — stock updates
                    live.
                  </p>
                </div>
                <a
                  href={wa(
                    'Hi Ring Nepal, show me your newest arrivals please!',
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-pink transition-colors hover:text-gold-light"
                >
                  Ask for new drops →
                </a>
              </div>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {newArrivals.map((item, i) => {
                const out =
                  showStock &&
                  item.trackStock &&
                  getStockStatus(item) === 'out'
                return (
                  <Reveal key={item.id} delay={i * 50}>
                    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition-all hover:-translate-y-1 hover:bg-white/10">
                      <button
                        type="button"
                        onClick={() => setQuickView(item)}
                        className="relative block w-full aspect-[4/5] overflow-hidden bg-ink-soft text-left"
                      >
                        <ResolvedCover
                          src={item.image}
                          alt={item.name}
                          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                          <span className="rounded-full bg-pink px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm">
                            New
                          </span>
                          <StockBadge product={item} show={showStock} />
                        </div>
                      </button>
                      <div className="p-5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-pink">
                          {item.meta}
                        </p>
                        <h3 className="mt-1 text-lg font-medium text-white">
                          <button
                            type="button"
                            onClick={() => setQuickView(item)}
                            className="text-left hover:text-pink"
                          >
                            {item.name}
                          </button>
                        </h3>
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-white/95">
                            {item.price}
                          </p>
                          {out ? (
                            <span className="rounded-full bg-white/10 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">
                              Sold out
                            </span>
                          ) : (
                            <a
                              href={wa(
                                buildOrderMessage({
                                  name: item.name,
                                  price: item.price,
                                  stock: item.stock,
                                  trackStock: showStock && item.trackStock,
                                  image: item.image,
                                  sku: item.sku || undefined,
                                  category: item.meta || undefined,
                                  note: 'From: New arrivals',
                                }),
                              )}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-pink hover:text-white"
                            >
                              <MessageCircle className="size-3.5" />
                              Order
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section id="featured" className="bg-white px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="mb-8 flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-pink">
                  Bestsellers
                </p>
                <h2 className="mt-2 font-script text-4xl text-ink md:text-5xl">
                  What everyone’s grabbing
                </h2>
                <p className="mt-2 max-w-md text-sm text-stone">
                  Jewelry, beauty, perfume, gifts & more. Tap to zoom, filter by
                  type, then Order on WhatsApp.
                </p>
              </div>
              <a
                href={wa('Hi Ring Nepal, show me bestsellers!')}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-pink-deep transition-colors hover:text-pink"
              >
                Ask on WhatsApp →
              </a>
            </div>
          </Reveal>

          {/* Search + category chips — practical for 10+ SKUs */}
          <div className="mb-6 space-y-3">
            <label className="relative block max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search jewelry, beauty, perfume, gifts…"
                className="w-full rounded-full border border-line bg-blush/60 py-2.5 pl-10 pr-4 text-sm text-ink outline-none placeholder:text-stone/70 focus:border-pink"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                label="All"
                active={!category}
                onClick={() => setCategory(null)}
              />
              {categoryNames.map((name) => (
                <FilterChip
                  key={name}
                  label={name}
                  active={category?.toLowerCase() === name.toLowerCase()}
                  onClick={() =>
                    setCategory(
                      category?.toLowerCase() === name.toLowerCase()
                        ? null
                        : name,
                    )
                  }
                />
              ))}
              {(category || query) && (
                <button
                  type="button"
                  onClick={() => {
                    setCategory(null)
                    setQuery('')
                  }}
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-stone hover:text-ink"
                >
                  <X className="size-3" />
                  Clear
                </button>
              )}
            </div>
            <p className="text-xs text-stone">
              Showing {filtered.length} of {products.length} products
              {category ? ` · ${category}` : ''}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item, i) => {
              const out =
                showStock &&
                item.trackStock &&
                getStockStatus(item) === 'out'
              return (
                <Reveal key={item.id} delay={i * 40}>
                  <article className="group overflow-hidden rounded-3xl border border-line bg-blush/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <button
                      type="button"
                      onClick={() => setQuickView(item)}
                      className="relative block w-full aspect-[4/5] overflow-hidden bg-mist text-left"
                    >
                      <ResolvedCover
                        src={item.image}
                        alt={item.name}
                        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                        {item.isNew && (
                          <span className="rounded-full bg-pink px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm">
                            New
                          </span>
                        )}
                        <StockBadge product={item} show={showStock} />
                      </div>
                      <span className="absolute bottom-3 right-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                        Quick view
                      </span>
                    </button>
                    <div className="p-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-pink">
                        {item.meta}
                      </p>
                      <h3 className="mt-1 text-lg font-medium text-ink">
                        <button
                          type="button"
                          onClick={() => setQuickView(item)}
                          className="text-left hover:text-pink-deep"
                        >
                          {item.name}
                        </button>
                      </h3>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-ink">
                          {item.price}
                        </p>
                        {out ? (
                          <span className="rounded-full bg-stone/15 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-stone">
                            Sold out
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setQuickView(item)}
                              className="rounded-full border border-line bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink hover:border-pink/40"
                            >
                              Options
                            </button>
                            <a
                              href={wa(
                                buildOrderMessage({
                                  name: item.name,
                                  price: item.price,
                                  stock: item.stock,
                                  trackStock: showStock && item.trackStock,
                                  image: item.image,
                                  sku: item.sku || undefined,
                                  category: item.meta || undefined,
                                }),
                              )}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-ink-soft"
                            >
                              <MessageCircle className="size-3.5" />
                              Order
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>
          {!filtered.length && products.length > 0 && (
            <p className="mt-8 text-center text-sm text-stone">
              No products match that filter.{' '}
              <button
                type="button"
                className="font-semibold text-pink"
                onClick={() => {
                  setCategory(null)
                  setQuery('')
                }}
              >
                Clear filters
              </button>
            </p>
          )}
          {!products.length && (
            <p className="text-center text-sm text-stone">
              No products yet — add them in{' '}
              <a href="/admin" className="font-semibold text-pink">
                Admin
              </a>
              .
            </p>
          )}
        </div>
      </section>

      <section id="how" className="bg-blush px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="mb-10 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-pink">
                Easy order
              </p>
              <h2 className="mt-2 font-script text-4xl text-ink md:text-5xl">
                How to buy
              </h2>
            </div>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {orderSteps.map((s, i) => (
              <Reveal key={s.step} delay={i * 70}>
                <div className="rounded-3xl border border-line bg-white p-6 shadow-sm">
                  <p className="text-xs font-semibold tracking-[0.2em] text-pink">
                    {s.step}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={150}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <a
                href={wa('Hi Ring Nepal, I want to place an order!')}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1ebe57]"
              >
                <MessageCircle className="size-4" />
                Start WhatsApp order
              </a>
              <a
                href={brand.daraz}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-pink hover:text-pink"
              >
                Shop on Daraz
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="collections" className="bg-white px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="mb-10 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-pink">
                Collections
              </p>
              <h2 className="mt-2 font-script text-4xl text-ink md:text-5xl">
                Shop by type
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-sm text-stone">
                Rings, earrings, necklaces, bracelets, scarves & sunglasses.
                Tap a category to filter products.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => (
              <Reveal key={cat.id} delay={i * 60}>
                <CategoryCard
                  name={cat.name}
                  blurb={cat.blurb}
                  image={cat.image}
                  active={category?.toLowerCase() === cat.name.toLowerCase()}
                  onSelect={() =>
                    selectCategory(
                      category?.toLowerCase() === cat.name.toLowerCase()
                        ? null
                        : cat.name,
                    )
                  }
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="story" className="bg-ink px-5 py-16 text-center text-white md:px-8 md:py-20">
        <Reveal>
          <img
            src="/brand/logo-white.png"
            alt={brand.nameNp}
            className="mx-auto h-24 w-auto md:h-28"
          />
          <p className="mt-5 text-xl font-semibold tracking-[0.1em] md:text-2xl">
            {brand.name}
          </p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.35em] text-pink">
            Estd {brand.estd} · {brand.storeCount} stores · {brand.city}
          </p>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/65 md:text-base">
            Jewelry, beauty, perfume, gifts & cute finds — same vibe as{' '}
            {brand.instagramHandle}. Browse anytime, order on WhatsApp, or visit
            a store to try pieces in person.
          </p>
          <div className="mx-auto mt-8 flex max-w-lg flex-wrap items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">
            <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5">
              {brand.storeCount} stores
            </span>
            <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5">
              WhatsApp order
            </span>
            <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5">
              Valley COD
            </span>
            <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5">
              {brand.instagramHandle}
            </span>
          </div>
        </Reveal>
      </section>

      <section id="stores" className="bg-blush px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="mb-10 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-pink">
                Visit us
              </p>
              <h2 className="mt-2 font-script text-4xl text-ink md:text-5xl">
                Stores near you
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-stone">
                Call the branch or WhatsApp with the store name pre-filled —
                staff know where you want pickup.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stores.map((s, i) => (
              <Reveal key={s.id} delay={i * 40}>
                <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-4 transition-colors hover:border-pink/30">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-pink" />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-ink">{s.name}</h3>
                      <p className="mt-0.5 text-xs text-stone">{s.note}</p>
                    </div>
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2 pt-3">
                    {s.phone ? (
                      <a
                        href={`tel:+977${s.phone.replace(/\D/g, '').replace(/^977/, '')}`}
                        className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1.5 text-xs font-medium text-ink hover:border-pink/40"
                        title="Call store"
                      >
                        <Phone className="size-3" />
                        {s.phone}
                      </a>
                    ) : (
                      <a
                        href={brand.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-full border border-line px-2.5 py-1.5 text-xs text-stone"
                      >
                        DM {brand.instagramHandle}
                      </a>
                    )}
                    <a
                      href={wa(buildStoreVisitMessage(s.name, s.note))}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full bg-[#25D366]/12 px-2.5 py-1.5 text-xs font-semibold text-[#128C7E] hover:bg-[#25D366]/20"
                    >
                      <MessageCircle className="size-3" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="legal" className="border-t border-line bg-white px-5 py-14 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2">
          <div id="privacy">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-pink">
              Privacy
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-stone">
              When you order via WhatsApp or contact us, we use your name, phone,
              and message only to complete your order and answer questions. We do
              not sell your data. Messages are handled on WhatsApp / Instagram under
              those apps’ policies. For data questions, message{' '}
              {brand.instagramHandle}.
            </p>
          </div>
          <div id="terms">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-pink">
              Order notes
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-stone">
              {[
                'Prices shown are guide ranges; final price confirmed on WhatsApp with stock.',
                'Delivery times are estimates for Kathmandu Valley; outside areas may take longer.',
                'Returns / exchanges: message us within 24 hours of delivery with photos if needed.',
                'Visit any listed store to try pieces in person when available.',
              ].map((line) => (
                <li key={line} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-pink" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="border-t border-line bg-blush px-5 py-12 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img src="/brand/logo-black.png" alt={brand.name} className="h-12 w-auto" />
            <div>
              <p className="text-sm font-medium text-ink">{brand.nameNp}</p>
              <p className="text-xs text-stone">
                Estd {brand.estd} · {brand.city}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-medium uppercase tracking-[0.14em] text-stone">
            <a href={brand.instagram} target="_blank" rel="noreferrer" className="hover:text-pink">
              Instagram
            </a>
            <a href={wa('Hi Ring Nepal!')} target="_blank" rel="noreferrer" className="hover:text-pink">
              WhatsApp
            </a>
            <a href={brand.daraz} target="_blank" rel="noreferrer" className="hover:text-pink">
              Daraz
            </a>
            <a href="#stores" className="hover:text-pink">
              Stores
            </a>
            <a href="/admin" className="hover:text-pink">
              Admin
            </a>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-7xl text-xs text-stone/60">
          © {new Date().getFullYear()} {brand.name} · {brand.instagramHandle}
        </p>
      </footer>

      {quickView && (
        <ProductQuickView
          product={quickView}
          stores={stores}
          showStock={showStock}
          wa={wa}
          onClose={() => setQuickView(null)}
        />
      )}
    </>
  )
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? 'bg-ink text-white'
          : 'border border-line bg-blush/50 text-ink hover:border-pink/40'
      }`}
    >
      {label}
    </button>
  )
}
