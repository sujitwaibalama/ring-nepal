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

/** Digits only, Nepal country code when missing (10-digit local mobiles). */
export function normalizeWhatsappDigits(whatsapp: string): string {
  let d = (whatsapp || '').replace(/\D/g, '')
  if (d.length === 10 && /^9\d{9}$/.test(d)) d = `977${d}`
  return d
}

export function waLink(whatsapp: string, message?: string) {
  const digits = normalizeWhatsappDigits(whatsapp)
  const base = `https://wa.me/${digits}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}

/**
 * Turn handles / partial paste into a real Instagram profile URL.
 * Prevents relative hrefs like "rings.nepal" that SPA-route to home.
 */
export function normalizeInstagramUrl(raw: string, fallback = 'rings.nepal'): string {
  const t = (raw || '').trim()
  if (!t) return `https://www.instagram.com/${fallback}/`

  try {
    if (/^https?:\/\//i.test(t)) {
      const u = new URL(t)
      if (u.hostname.replace(/^www\./, '').includes('instagram.com')) {
        const seg = u.pathname.replace(/^\/+|\/+$/g, '').split('/')[0]
        if (seg && !['p', 'reel', 'reels', 'stories', 'explore'].includes(seg.toLowerCase())) {
          return `https://www.instagram.com/${seg}/`
        }
      }
      return t
    }
  } catch {
    /* fall through */
  }

  let handle = t.replace(/^@/, '')
  handle = handle.replace(/^(https?:\/\/)?(www\.)?instagram\.com\//i, '')
  handle = handle.split(/[/?#]/)[0].replace(/\/+$/g, '')
  if (!handle) handle = fallback
  return `https://www.instagram.com/${handle}/`
}

/** Absolute Daraz URL (short links or full shop URLs both OK). */
export function normalizeDarazUrl(
  raw: string,
  fallback = 'https://www.daraz.com.np/shop/ghoptohs',
): string {
  const t = (raw || '').trim()
  if (!t) return fallback
  if (/^https?:\/\//i.test(t)) return t
  if (t.startsWith('//')) return `https:${t}`
  if (/daraz\.com/i.test(t)) return `https://${t.replace(/^\/+/, '')}`
  return fallback
}

/** Nepal store landline / mobile → tel:+977… */
export function telHref(phone: string): string {
  let d = (phone || '').replace(/\D/g, '')
  if (d.startsWith('977')) d = d.slice(3)
  return d ? `tel:+977${d}` : '#'
}

/** Safe attrs for any outbound shop / social link */
export const EXTERNAL_LINK_PROPS = {
  target: '_blank' as const,
  rel: 'noopener noreferrer' as const,
}

/** Normalize brand social fields after load / admin save */
export function normalizeBrandLinks<T extends BrandConfig>(brand: T): T {
  const instagram = normalizeInstagramUrl(brand.instagram)
  let handle = (brand.instagramHandle || '').trim()
  if (!handle || handle === '@') {
    const seg = instagram.replace(/\/+$/, '').split('/').pop() || 'rings.nepal'
    handle = `@${seg.replace(/^@/, '')}`
  } else if (!handle.startsWith('@')) {
    handle = `@${handle}`
  }
  return {
    ...brand,
    instagram,
    instagramHandle: handle,
    daraz: normalizeDarazUrl(brand.daraz),
    whatsapp: normalizeWhatsappDigits(brand.whatsapp),
  }
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
