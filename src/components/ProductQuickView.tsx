import { useEffect, useId, useState } from 'react'
import { MapPin, MessageCircle, Truck, X } from 'lucide-react'
import type { Product, Store } from '../data/types'
import { getStockStatus } from '../data/types'
import {
  buildOrderMessage,
  type OrderFulfillment,
} from '../lib/orderMessage'
import { ResolvedCover } from './ResolvedMedia'
import { StockBadge } from './StockBadge'

type Props = {
  product: Product
  stores: Store[]
  showStock: boolean
  wa: (message?: string) => string
  onClose: () => void
}

export function ProductQuickView({
  product,
  stores,
  showStock,
  wa,
  onClose,
}: Props) {
  const titleId = useId()
  const out =
    showStock && product.trackStock && getStockStatus(product) === 'out'
  const [fulfillment, setFulfillment] = useState<OrderFulfillment>('undecided')
  const [store, setStore] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    document.body.dataset.modalOpen = 'true'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      delete document.body.dataset.modalOpen
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const message = buildOrderMessage({
    name: product.name,
    price: product.price,
    stock: product.stock,
    trackStock: showStock && product.trackStock,
    image: product.image,
    sku: product.sku || undefined,
    category: product.meta || undefined,
    preferredStore: store || undefined,
    fulfillment,
    note: note || undefined,
  })

  return (
    <div
      className="sheet-backdrop fixed inset-0 z-[80] flex items-end justify-center bg-ink/55 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div
        className="sheet-panel flex max-h-[94svh] w-full max-w-lg flex-col overflow-hidden rounded-t-[1.75rem] bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile sheet cue) */}
        <div className="flex shrink-0 justify-center pt-2.5 sm:hidden" aria-hidden>
          <span className="h-1 w-10 rounded-full bg-stone/25" />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="relative w-full overflow-hidden bg-mist">
            <div className="relative mx-auto h-[min(42svh,360px)] w-full sm:h-[min(50vh,420px)]">
              <ResolvedCover
                src={product.image}
                alt={product.name}
                className="absolute inset-0 m-auto block h-full w-full object-cover object-center"
              />
            </div>
            <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
              {product.isNew && (
                <span className="rounded-full bg-pink px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm">
                  New
                </span>
              )}
              <StockBadge product={product} show={showStock} />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="pressable absolute right-3 top-3 z-10 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white/95 text-ink shadow-sm hover:bg-white"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="space-y-5 p-5 pb-28 sm:p-6 sm:pb-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-pink">
                {product.meta}
              </p>
              <h2 id={titleId} className="mt-1 text-xl font-semibold text-ink">
                {product.name}
              </h2>
              <p className="mt-2 text-base font-semibold text-ink">{product.price}</p>
              {product.sku && (
                <p className="mt-1 text-xs text-stone">Code: {product.sku}</p>
              )}
              <p className="mt-2 text-sm text-stone">
                Final price & stock confirmed on WhatsApp. Pick how you want it —
                so staff can reply faster.
              </p>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-stone">
                How do you want it?
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <FulfillChip
                  active={fulfillment === 'delivery'}
                  onClick={() => setFulfillment('delivery')}
                  icon={<Truck className="size-3.5" />}
                  label="Delivery"
                />
                <FulfillChip
                  active={fulfillment === 'pickup'}
                  onClick={() => setFulfillment('pickup')}
                  icon={<MapPin className="size-3.5" />}
                  label="Store pickup"
                />
              </div>
            </div>

            {(fulfillment === 'pickup' || fulfillment === 'delivery') && (
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone">
                {fulfillment === 'pickup'
                  ? 'Preferred store'
                  : 'Nearest store (optional)'}
                <select
                  value={store}
                  onChange={(e) => setStore(e.target.value)}
                  className="mt-1.5 min-h-12 w-full rounded-xl border border-line bg-blush/60 px-3 py-3 text-base font-normal normal-case tracking-normal text-ink outline-none focus:border-pink sm:min-h-0 sm:py-2.5 sm:text-sm"
                >
                  <option value="">Select a store…</option>
                  {stores.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                      {s.note ? ` · ${s.note}` : ''}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone">
              Size / color / gift note (optional)
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. size 7, rose gold, gift wrap"
                className="mt-1.5 min-h-12 w-full rounded-xl border border-line bg-blush/60 px-3 py-3 text-base font-normal normal-case tracking-normal text-ink outline-none focus:border-pink sm:min-h-0 sm:py-2.5 sm:text-sm"
              />
            </label>

            {/* Desktop-only inline CTA; mobile uses sticky bar */}
            <div className="hidden sm:block">
              {out ? (
                <p className="rounded-2xl bg-stone/10 px-4 py-3 text-center text-sm font-medium text-stone">
                  Sold out online — message us for similar pieces.
                </p>
              ) : (
                <>
                  <a
                    href={wa(message)}
                    target="_blank"
                    rel="noreferrer"
                    className="pressable flex w-full min-h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 text-sm font-semibold text-white hover:bg-[#1ebe57]"
                  >
                    <MessageCircle className="size-4" />
                    Order on WhatsApp
                  </a>
                  <a
                    href={wa(
                      buildOrderMessage({
                        name: product.name,
                        price: product.price,
                        stock: product.stock,
                        trackStock: showStock && product.trackStock,
                        image: product.image,
                        sku: product.sku || undefined,
                        category: product.meta || undefined,
                      }),
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 block text-center text-xs font-medium text-stone underline decoration-pink/30 hover:text-pink"
                  >
                    Quick order without options
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sticky mobile order bar — always one thumb-tap away */}
        <div className="safe-bottom shrink-0 border-t border-line bg-white/95 px-4 pt-3 backdrop-blur-md sm:hidden">
          {out ? (
            <p className="rounded-2xl bg-stone/10 px-4 py-3 text-center text-sm font-medium text-stone">
              Sold out — ask for similar
            </p>
          ) : (
            <div className="space-y-2">
              <a
                href={wa(message)}
                target="_blank"
                rel="noreferrer"
                className="pressable flex w-full min-h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 text-sm font-semibold text-white hover:bg-[#1ebe57]"
              >
                <MessageCircle className="size-5" />
                Order on WhatsApp
              </a>
              <a
                href={wa(
                  buildOrderMessage({
                    name: product.name,
                    price: product.price,
                    stock: product.stock,
                    trackStock: showStock && product.trackStock,
                    image: product.image,
                    sku: product.sku || undefined,
                    category: product.meta || undefined,
                  }),
                )}
                target="_blank"
                rel="noreferrer"
                className="block py-1 text-center text-xs font-medium text-stone"
              >
                Quick order without options
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FulfillChip({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`chip inline-flex min-h-12 items-center justify-center gap-1.5 rounded-full border px-3 py-3 text-xs font-semibold ${
        active
          ? 'border-ink bg-ink text-white shadow-sm'
          : 'border-line bg-blush/50 text-ink hover:border-pink/40'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
