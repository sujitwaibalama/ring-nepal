import { defaultCatalog } from '../data/defaultCatalog'
import { normalizeBrandLinks, type Catalog, type Product } from '../data/types'

const STORAGE_KEY = 'ringnepal_catalog_v1'
const AUTH_KEY = 'ringnepal_admin_auth'

export function deepCloneCatalog(c: Catalog): Catalog {
  return JSON.parse(JSON.stringify(c)) as Catalog
}

/** Load: localStorage (admin edits) → else fetch public JSON → else defaults */
export async function loadCatalog(): Promise<Catalog> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Catalog
      if (parsed?.bestsellers && parsed?.brand) {
        return normalizeCatalog(parsed)
      }
    }
  } catch {
    /* ignore */
  }

  try {
    const res = await fetch(`/data/catalog.json?t=${Date.now()}`)
    if (res.ok) {
      const json = (await res.json()) as Catalog
      return normalizeCatalog(json)
    }
  } catch {
    /* ignore */
  }

  return deepCloneCatalog(defaultCatalog)
}

function normalizeProduct(p: Partial<Product>, defaults: Catalog): Product {
  const low = defaults.brand.defaultLowStockAt ?? 5
  return {
    id: p.id || `p_${Math.random().toString(36).slice(2, 9)}`,
    name: p.name || 'Untitled',
    meta: p.meta || 'General',
    price: p.price || 'Rs. 0',
    image: p.image || '',
    active: p.active !== false,
    sku: p.sku ?? '',
    stock: typeof p.stock === 'number' ? p.stock : 10,
    lowStockAt: typeof p.lowStockAt === 'number' ? p.lowStockAt : low,
    trackStock: p.trackStock !== false,
    isNew: p.isNew === true,
  }
}

function normalizeCatalog(c: Catalog): Catalog {
  const base = deepCloneCatalog(defaultCatalog)
  const brand = normalizeBrandLinks({ ...base.brand, ...c.brand })
  const bestsellers = (c.bestsellers?.length ? c.bestsellers : base.bestsellers).map(
    (p) => normalizeProduct(p, { ...base, brand }),
  )
  return {
    ...base,
    ...c,
    brand,
    hero: { ...base.hero, ...c.hero },
    showreel: c.showreel?.length ? c.showreel : base.showreel,
    bestsellers,
    categories: c.categories?.length ? c.categories : base.categories,
    stores: c.stores?.length ? c.stores : base.stores,
    orderSteps: c.orderSteps?.length ? c.orderSteps : base.orderSteps,
    activity: c.activity?.length ? c.activity : base.activity,
  }
}

/** Save admin changes so the customer site updates immediately (this browser) */
export function saveCatalog(catalog: Catalog): Catalog {
  const next: Catalog = {
    ...catalog,
    updatedAt: new Date().toISOString(),
    version: (catalog.version || 1) + 1,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export function clearLocalCatalog() {
  localStorage.removeItem(STORAGE_KEY)
}

export function downloadCatalogJson(catalog: Catalog) {
  const blob = new Blob([JSON.stringify(catalog, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'catalog.json'
  a.click()
  URL.revokeObjectURL(url)
}

export function isAdminAuthed(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === '1'
}

export function setAdminAuthed(ok: boolean) {
  if (ok) sessionStorage.setItem(AUTH_KEY, '1')
  else sessionStorage.removeItem(AUTH_KEY)
}
