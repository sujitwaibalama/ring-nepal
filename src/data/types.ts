export type BrandConfig = {
  name: string
  nameNp: string
  tagline: string
  estd: string
  city: string
  storeCount: number
  instagram: string
  instagramHandle: string
  daraz: string
  /** Digits with country code, no +  e.g. 9779823770857 */
  whatsapp: string
  deliveryNote: string
  /** Simple admin password — change before go-live */
  adminPassword: string
  /** Show stock badges on the customer shop */
  showStockOnSite: boolean
  /** Default low-stock threshold for new products */
  defaultLowStockAt: number
}

export type HeroConfig = {
  video: string
  poster: string
  eyebrow: string
  line1: string
  line2: string
  subtitle: string
}

export type ShowreelItem = {
  id: string
  src: string
  name: string
  tag: string
  price: string
}

export type Product = {
  id: string
  name: string
  meta: string
  price: string
  image: string
  /** false = hide from storefront */
  active: boolean
  /** Optional SKU / code for staff */
  sku: string
  /** Units remaining (when trackStock is true) */
  stock: number
  /** Alert when stock <= this number */
  lowStockAt: number
  /** If false, stock is not shown / not enforced */
  trackStock: boolean
  /**
   * Show in “Just arrived” / New section on the shop.
   * Owner toggles this when a drop comes in — better than Instagram grid alone.
   */
  isNew: boolean
}

export type Category = {
  id: string
  name: string
  blurb: string
  image: string
}

export type Store = {
  id: string
  name: string
  phone: string
  note: string
}

export type OrderStep = {
  step: string
  title: string
  text: string
}

export type ActivityEntry = {
  id: string
  at: string
  message: string
}

export type Catalog = {
  version: number
  updatedAt: string
  brand: BrandConfig
  hero: HeroConfig
  showreel: ShowreelItem[]
  bestsellers: Product[]
  categories: Category[]
  stores: Store[]
  orderSteps: OrderStep[]
  /** Recent admin actions (kept short) */
  activity: ActivityEntry[]
}

export type StockStatus = 'ok' | 'low' | 'out' | 'untracked'

export function getStockStatus(p: Product): StockStatus {
  if (!p.trackStock) return 'untracked'
  if (p.stock <= 0) return 'out'
  if (p.stock <= (p.lowStockAt ?? 5)) return 'low'
  return 'ok'
}

export function stockLabel(p: Product): string | null {
  const s = getStockStatus(p)
  if (s === 'untracked') return null
  if (s === 'out') return 'Out of stock'
  if (s === 'low') return `Only ${p.stock} left`
  return `${p.stock} in stock`
}

export function waLink(whatsapp: string, message?: string) {
  const base = `https://wa.me/${whatsapp.replace(/\D/g, '')}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}

export function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

export function pushActivity(
  catalog: Catalog,
  message: string,
  max = 40,
): Catalog {
  const entry: ActivityEntry = {
    id: uid('act'),
    at: new Date().toISOString(),
    message,
  }
  const activity = [entry, ...(catalog.activity || [])].slice(0, max)
  return { ...catalog, activity }
}
