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
import { EXTERNAL_LINK_PROPS, getStockStatus, telHref } from '../data/types'
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
      if (category && !matchesCategory(p, category)) return false
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

  /** Toggle category chip (shared by New + Bestsellers) */
  function toggleCategory(name: string | null) {
    if (!name) {
      setCategory(null)
      return
    }
    setCategory(
      category?.toLowerCase() === name.toLowerCase() ? null : name,
    )
  }

  function jumpToFullCategory(name: string) {
    setCategory(name)
    setQuery('')
    document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })
  }

  const newArrivals = useMemo(
    () => products.filter((p) => p.isNew),
    [products],
  )

  const filteredNew = useMemo(() => {
    if (!category) return newArrivals
    return newArrivals.filter((p) => matchesCategory(p, category))
  }, [newArrivals, category])

  return (
    <>
      <ProductShowreel />

      <div className="border-y border-line bg-blush px-4 py-4 sm:px-5 sm:py-5 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2.5 text-center sm:flex-row sm:justify-between sm:gap-3 sm:text-left">
          <p className="text-xs leading-relaxed text-ink-soft sm:text-sm">
            {brand.deliveryNote}
          </p>
          <div className="no-scrollbar flex max-w-full items-center gap-2 overflow-x-auto text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/70 sm:flex-wrap sm:justify-center sm:overflow-visible">
            <span className="shrink-0 rounded-full bg-white px-3 py-1.5 shadow-sm">
              {brand.storeCount} stores
            </span>
            <span className="shrink-0 rounded-full bg-white px-3 py-1.5 shadow-sm">
              WhatsApp order
            </span>
            <span className="shrink-0 rounded-full bg-white px-3 py-1.5 shadow-sm">
              COD available
            </span>
          </div>
        </div>
      </div>

      {/* New arrivals — digital window for drops (vs Instagram grid limits) */}
      {newArrivals.length > 0 && (
        <section
          id="new"
          className="bg-ink px-4 py-12 text-white sm:px-5 sm:py-14 md:px-8 md:py-16"
        >
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <div className="mb-5 flex flex-col items-start justify-between gap-3 sm:mb-6 md:flex-row md:items-end">
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
                    Instagram posts. Pick a type below — or order on WhatsApp.
                  </p>
                </div>
                <a
                  href={wa(
                    'Hi Ring Nepal, show me your newest arrivals please!',
                  )}
                  {...EXTERNAL_LINK_PROPS}
                  className="min-h-10 text-sm font-semibold text-pink transition-colors hover:text-gold-light"
                >
                  Ask for new drops →
                </a>
              </div>
            </Reveal>

            {/* Category chips — filter new drops without scrolling to bestsellers */}
            <div className="mb-5 sm:mb-6">
              <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
                <FilterChip
                  label="All"
                  active={!category}
                  onClick={() => toggleCategory(null)}
                  dark
                />
                {categoryNames.map((name) => (
                  <FilterChip
                    key={`new-${name}`}
                    label={name}
                    active={category?.toLowerCase() === name.toLowerCase()}
                    onClick={() => toggleCategory(name)}
                    dark
                  />
                ))}
              </div>
              <p className="mt-2 text-[11px] text-white/50">
                {category
                  ? `${filteredNew.length} new in ${category}`
                  : `${newArrivals.length} new arrivals`}
              </p>
            </div>

            {filteredNew.length > 0 ? (
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3">
                {filteredNew.map((item, i) => {
                  const out =
                    showStock &&
                    item.trackStock &&
                    getStockStatus(item) === 'out'
                  return (
                    <Reveal key={item.id} delay={i * 50}>
                      <article className="group card-lift flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:rounded-3xl hover:bg-white/10 hover:shadow-lg hover:shadow-black/20">
                        <button
                          type="button"
                          onClick={() => setQuickView(item)}
                          className="relative block w-full aspect-[4/5] overflow-hidden bg-ink-soft text-left"
                        >
                          <ResolvedCover
                            src={item.image}
                            alt={item.name}
                            className="media-zoom absolute inset-0 h-full w-full object-cover object-center"
                          />
                          <div className="absolute left-2 top-2 flex flex-wrap gap-1 sm:left-3 sm:top-3 sm:gap-1.5">
                            <span className="rounded-full bg-pink px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white shadow-sm sm:px-2.5 sm:py-1 sm:text-[10px]">
                              New
                            </span>
                            <StockBadge product={item} show={showStock} />
                          </div>
                        </button>
                        <div className="flex flex-1 flex-col p-2.5 sm:p-5">
                          <p className="truncate text-[9px] font-semibold uppercase tracking-[0.16em] text-pink sm:text-[10px] sm:tracking-[0.2em]">
                            {item.meta}
                          </p>
                          <h3 className="mt-0.5 line-clamp-2 text-sm font-medium leading-snug text-white sm:mt-1 sm:text-lg">
                            <button
                              type="button"
                              onClick={() => setQuickView(item)}
                              className="text-left hover:text-pink"
                            >
                              {item.name}
                            </button>
                          </h3>
                          <div className="mt-auto flex flex-col gap-2 pt-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pt-4">
                            <p className="text-xs font-semibold text-white/95 sm:text-sm">
                              {item.price}
                            </p>
                            {out ? (
                              <span className="rounded-full bg-white/10 px-2.5 py-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.1em] text-white/50 sm:px-3.5 sm:py-2 sm:text-[11px]">
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
                                {...EXTERNAL_LINK_PROPS}
                                className="pressable inline-flex min-h-9 w-full items-center justify-center gap-1 rounded-full bg-white px-2.5 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink hover:bg-pink hover:text-white sm:min-h-0 sm:w-auto sm:gap-1.5 sm:px-3.5 sm:text-[11px]"
                              >
                                <MessageCircle className="size-3 sm:size-3.5" />
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
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-8 text-center sm:rounded-3xl sm:py-10">
                <p className="text-sm text-white/70">
                  No new {category ?? 'items'} this week.
                </p>
                <p className="mt-1 text-xs text-white/45">
                  Browse the full catalog — same category is already selected.
                </p>
                {category && (
                  <button
                    type="button"
                    onClick={() => jumpToFullCategory(category)}
                    className="pressable mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-pink hover:text-white"
                  >
                    See all {category} →
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      <section
        id="featured"
        className="bg-white px-4 py-12 sm:px-5 sm:py-16 md:px-8 md:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:mb-8 md:flex-row md:items-end">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-pink">
                  Bestsellers
                </p>
                <h2 className="mt-2 font-script text-4xl text-ink md:text-5xl">
                  What everyone’s grabbing
                </h2>
                <p className="mt-2 max-w-md text-sm text-stone">
                  Jewelry, beauty, perfume, gifts & more. Tap a product, filter by
                  type, then Order on WhatsApp.
                </p>
              </div>
              <a
                href={wa('Hi Ring Nepal, show me bestsellers!')}
                {...EXTERNAL_LINK_PROPS}
                className="min-h-10 text-sm font-semibold text-pink-deep transition-colors hover:text-pink"
              >
                Ask on WhatsApp →
              </a>
            </div>
          </Reveal>

          {/* Search (static) + sticky chips — compact so products stay visible */}
          <div className="mb-4 space-y-2.5 sm:mb-6 sm:space-y-3">
            <label className="relative block max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search jewelry, beauty, perfume…"
                enterKeyHint="search"
                className="min-h-11 w-full rounded-full border border-line bg-blush/60 py-2.5 pl-10 pr-4 text-base text-ink outline-none placeholder:text-stone/70 focus:border-pink sm:min-h-0 sm:text-sm"
              />
            </label>
            <div className="sticky top-[3.5rem] z-20 -mx-4 border-b border-line/70 bg-white/95 px-4 py-2 backdrop-blur-md sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
              <div className="no-scrollbar -mx-0.5 flex gap-2 overflow-x-auto px-0.5 pb-0.5 sm:flex-wrap sm:overflow-visible">
                <FilterChip
                  label="All"
                  active={!category}
                  onClick={() => toggleCategory(null)}
                />
                {categoryNames.map((name) => (
                  <FilterChip
                    key={name}
                    label={name}
                    active={category?.toLowerCase() === name.toLowerCase()}
                    onClick={() => toggleCategory(name)}
                  />
                ))}
                {(category || query) && (
                  <button
                    type="button"
                    onClick={() => {
                      setCategory(null)
                      setQuery('')
                    }}
                    className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-full px-3 py-2 text-xs font-medium text-stone hover:text-ink"
                  >
                    <X className="size-3" />
                    Clear
                  </button>
                )}
              </div>
              <p className="mt-1.5 text-[11px] text-stone sm:mt-2 sm:text-xs">
                Showing {filtered.length} of {products.length} products
                {category ? ` · ${category}` : ''}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3">
            {filtered.map((item, i) => {
              const out =
                showStock &&
                item.trackStock &&
                getStockStatus(item) === 'out'
              return (
                <Reveal key={item.id} delay={i * 40}>
                  <article className="group card-lift flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-blush/50 sm:rounded-3xl hover:border-pink/25 hover:shadow-md">
                    <button
                      type="button"
                      onClick={() => setQuickView(item)}
                      className="relative block w-full aspect-[4/5] overflow-hidden bg-mist text-left"
                    >
                      <ResolvedCover
                        src={item.image}
                        alt={item.name}
                        className="media-zoom absolute inset-0 h-full w-full object-cover object-center"
                      />
                      <div className="absolute left-2 top-2 flex flex-wrap gap-1 sm:left-3 sm:top-3 sm:gap-1.5">
                        {item.isNew && (
                          <span className="rounded-full bg-pink px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white shadow-sm sm:px-2.5 sm:py-1 sm:text-[10px]">
                            New
                          </span>
                        )}
                        <StockBadge product={item} show={showStock} />
                      </div>
                      {/* Always visible on touch; hover-only on desktop */}
                      <span className="absolute bottom-2 right-2 rounded-full bg-white/95 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-ink shadow-sm transition-all duration-300 sm:bottom-3 sm:right-3 sm:translate-y-1 sm:px-2.5 sm:text-[10px] sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                        View
                      </span>
                    </button>
                    <div className="flex flex-1 flex-col p-2.5 sm:p-5">
                      <p className="truncate text-[9px] font-semibold uppercase tracking-[0.16em] text-pink sm:text-[10px] sm:tracking-[0.2em]">
                        {item.meta}
                      </p>
                      <h3 className="mt-0.5 line-clamp-2 text-sm font-medium leading-snug text-ink sm:mt-1 sm:text-lg">
                        <button
                          type="button"
                          onClick={() => setQuickView(item)}
                          className="text-left hover:text-pink-deep"
                        >
                          {item.name}
                        </button>
                      </h3>
                      <div className="mt-auto flex flex-col gap-2 pt-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pt-4">
                        <p className="text-xs font-semibold text-ink sm:text-sm">
                          {item.price}
                        </p>
                        {out ? (
                          <span className="rounded-full bg-stone/15 px-2.5 py-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.1em] text-stone sm:px-3.5 sm:py-2 sm:text-[11px]">
                            Sold out
                          </span>
                        ) : (
                          <div className="grid grid-cols-2 gap-1.5 sm:flex sm:items-center">
                            <button
                              type="button"
                              onClick={() => setQuickView(item)}
                              className="pressable min-h-9 rounded-full border border-line bg-white px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink hover:border-pink/40 sm:min-h-0 sm:px-3 sm:text-[11px]"
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
                              {...EXTERNAL_LINK_PROPS}
                              className="pressable inline-flex min-h-9 items-center justify-center gap-1 rounded-full bg-ink px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-white hover:bg-ink-soft sm:min-h-0 sm:gap-1.5 sm:px-3.5 sm:text-[11px]"
                            >
                              <MessageCircle className="size-3 sm:size-3.5" />
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

      <section
        id="how"
        className="bg-blush px-4 py-12 sm:px-5 sm:py-16 md:px-8 md:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="mb-8 text-center sm:mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-pink">
                Easy order
              </p>
              <h2 className="mt-2 font-script text-4xl text-ink md:text-5xl">
                How to buy
              </h2>
            </div>
          </Reveal>
          <div className="grid gap-3 sm:gap-6 md:grid-cols-3">
            {orderSteps.map((s, i) => (
              <Reveal key={s.step} delay={i * 70}>
                <div className="card-lift rounded-2xl border border-line bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6 hover:border-pink/20 hover:shadow-md">
                  <p className="text-xs font-semibold tracking-[0.2em] text-pink">
                    {s.step}
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-ink sm:mt-3 sm:text-lg">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={150}>
            <div className="mt-8 flex flex-col items-stretch gap-2.5 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
              <a
                href={wa('Hi Ring Nepal, I want to place an order!')}
                {...EXTERNAL_LINK_PROPS}
                className="pressable inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#1ebe57]"
              >
                <MessageCircle className="size-4" />
                Start WhatsApp order
              </a>
              <a
                href={brand.daraz}
                {...EXTERNAL_LINK_PROPS}
                className="pressable inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink/15 bg-white px-6 py-3.5 text-sm font-semibold text-ink hover:border-pink hover:text-pink"
              >
                Shop on Daraz
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        id="collections"
        className="bg-white px-4 py-12 sm:px-5 sm:py-16 md:px-8 md:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="mb-8 text-center sm:mb-10">
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
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3">
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

      <section
        id="story"
        className="bg-ink px-4 py-12 text-center text-white sm:px-5 sm:py-16 md:px-8 md:py-20"
      >
        <Reveal>
          <img
            src="/brand/logo-white.png"
            alt={brand.nameNp}
            className="mx-auto h-20 w-auto sm:h-24 md:h-28"
          />
          <p className="mt-4 text-lg font-semibold tracking-[0.1em] sm:mt-5 sm:text-xl md:text-2xl">
            {brand.name}
          </p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-pink sm:text-[11px] sm:tracking-[0.35em]">
            Estd {brand.estd} · {brand.storeCount} stores · {brand.city}
          </p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/65 sm:mt-5 md:text-base">
            Jewelry, beauty, perfume, gifts & cute finds — same vibe as{' '}
            {brand.instagramHandle}. Browse anytime, order on WhatsApp, or visit
            a store to try pieces in person.
          </p>
          <div className="mx-auto mt-6 flex max-w-lg flex-wrap items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80 sm:mt-8 sm:text-[11px] sm:tracking-[0.14em]">
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

      <section
        id="stores"
        className="bg-blush px-4 py-12 sm:px-5 sm:py-16 md:px-8 md:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="mb-8 text-center sm:mb-10">
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
          <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
            {stores.map((s, i) => (
              <Reveal key={s.id} delay={i * 40}>
                <div className="card-lift flex h-full flex-col rounded-2xl border border-line bg-white p-3.5 sm:p-4 hover:border-pink/30 hover:shadow-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-pink" />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-ink">{s.name}</h3>
                      <p className="mt-0.5 text-xs text-stone">{s.note}</p>
                    </div>
                  </div>
                  <div className="mt-auto grid grid-cols-2 gap-2 pt-3">
                    {s.phone ? (
                      <a
                        href={telHref(s.phone)}
                        className="pressable inline-flex min-h-10 items-center justify-center gap-1 rounded-full border border-line px-2 py-2 text-xs font-medium text-ink hover:border-pink/40"
                        title="Call store"
                      >
                        <Phone className="size-3.5 shrink-0" />
                        <span className="truncate">Call</span>
                      </a>
                    ) : (
                      <a
                        href={brand.instagram}
                        {...EXTERNAL_LINK_PROPS}
                        className="pressable inline-flex min-h-10 items-center justify-center rounded-full border border-line px-2 py-2 text-xs text-stone"
                      >
                        DM
                      </a>
                    )}
                    <a
                      href={wa(buildStoreVisitMessage(s.name, s.note))}
                      {...EXTERNAL_LINK_PROPS}
                      className="pressable inline-flex min-h-10 items-center justify-center gap-1 rounded-full bg-[#25D366]/12 px-2 py-2 text-xs font-semibold text-[#128C7E] hover:bg-[#25D366]/20"
                    >
                      <MessageCircle className="size-3.5 shrink-0" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        id="legal"
        className="border-t border-line bg-white px-4 py-12 sm:px-5 sm:py-14 md:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 md:gap-10">
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

      <footer
        className="border-t border-line bg-blush px-4 py-10 sm:px-5 sm:py-12 md:px-8"
        style={{
          paddingBottom: 'max(2.5rem, calc(env(safe-area-inset-bottom, 0px) + 5rem))',
        }}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <img
              src="/brand/logo-black.png"
              alt={brand.name}
              className="h-11 w-auto sm:h-12"
            />
            <div>
              <p className="text-sm font-medium text-ink">{brand.nameNp}</p>
              <p className="text-xs text-stone">
                Estd {brand.estd} · {brand.city}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-3 text-xs font-medium uppercase tracking-[0.14em] text-stone">
            <a
              href={brand.instagram}
              {...EXTERNAL_LINK_PROPS}
              className="min-h-10 inline-flex items-center hover:text-pink"
            >
              Instagram
            </a>
            <a
              href={wa('Hi Ring Nepal!')}
              {...EXTERNAL_LINK_PROPS}
              className="min-h-10 inline-flex items-center hover:text-pink"
            >
              WhatsApp
            </a>
            <a
              href={brand.daraz}
              {...EXTERNAL_LINK_PROPS}
              className="min-h-10 inline-flex items-center hover:text-pink"
            >
              Daraz
            </a>
            <a href="#stores" className="min-h-10 inline-flex items-center hover:text-pink">
              Stores
            </a>
            <a href="/admin" className="min-h-10 inline-flex items-center hover:text-pink">
              Admin
            </a>
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-7xl text-xs text-stone/60 sm:mt-8">
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

/** Word-level category match — never substring ("earrings" must not match "rings") */
function matchesCategory(product: Product, category: string): boolean {
  const cat = category.trim().toLowerCase()
  const meta = product.meta.trim().toLowerCase()
  const catFirst = cat.split(/[\s&/,+]+/).filter(Boolean)[0] ?? cat
  const metaFirst = meta.split(/[\s&/,+]+/).filter(Boolean)[0] ?? meta
  return (
    meta === cat ||
    (catFirst.length >= 3 && metaFirst === catFirst)
  )
}

function FilterChip({
  label,
  active,
  onClick,
  dark = false,
}: {
  label: string
  active: boolean
  onClick: () => void
  /** Dark section (New arrivals on black) */
  dark?: boolean
}) {
  const idle = dark
    ? 'border border-white/20 bg-white/5 text-white/85 hover:border-pink/50 hover:bg-white/10'
    : 'border border-line bg-blush/50 text-ink hover:border-pink/40'
  const on = dark
    ? 'bg-white text-ink'
    : 'bg-ink text-white'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`chip min-h-9 shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold ${
        active ? `${on} shadow-sm` : idle
      }`}
    >
      {label}
    </button>
  )
}
