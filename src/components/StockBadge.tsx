import type { Product } from '../data/types'
import { getStockStatus, stockLabel } from '../data/types'

/** Customer-facing stock pill */
export function StockBadge({
  product,
  show,
  className = '',
}: {
  product: Product
  show: boolean
  className?: string
}) {
  if (!show || !product.trackStock) return null
  const status = getStockStatus(product)
  const label = stockLabel(product)
  if (!label) return null

  const styles =
    status === 'out'
      ? 'bg-ink text-white'
      : status === 'low'
        ? 'bg-amber-500 text-white'
        : 'bg-white/90 text-ink'

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${styles} ${className}`}
    >
      {label}
    </span>
  )
}

/** Admin table / card stock chip */
export function AdminStockChip({ product }: { product: Product }) {
  if (!product.trackStock) {
    return (
      <span className="rounded-full bg-stone/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-stone">
        Not tracked
      </span>
    )
  }
  const status = getStockStatus(product)
  if (status === 'out') {
    return (
      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-red-800">
        Out · 0
      </span>
    )
  }
  if (status === 'low') {
    return (
      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-900">
        Low · {product.stock}
      </span>
    )
  }
  return (
    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-900">
      In stock · {product.stock}
    </span>
  )
}
