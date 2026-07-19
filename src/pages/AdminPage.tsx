import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCopy,
  Download,
  Eye,
  EyeOff,
  LayoutDashboard,
  LogOut,
  Minus,
  Package,
  Plus,
  Save,
  Search,
  Store as StoreIcon,
  Trash2,
} from 'lucide-react'
import { buildOrderMessage } from '../lib/orderMessage'
import { MediaDropzone } from '../components/admin/MediaDropzone'
import { AdminStockChip } from '../components/StockBadge'
import { useCatalog } from '../lib/CatalogContext'
import { isAdminAuthed, setAdminAuthed } from '../lib/catalogStore'
import { useResolvedMedia } from '../lib/useResolvedMedia'
import type { Catalog, Product, ShowreelItem, Store } from '../data/types'
import {
  getStockStatus,
  pushActivity,
  uid,
} from '../data/types'

type Tab =
  | 'dashboard'
  | 'products'
  | 'inventory'
  | 'showreel'
  | 'stores'
  | 'brand'

export function AdminPage() {
  const { catalog, save, exportJson, resetToDefault } = useCatalog()
  const [authed, setAuthed] = useState(isAdminAuthed())
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [tab, setTab] = useState<Tab>('dashboard')
  const [draft, setDraft] = useState<Catalog | null>(null)
  const [toast, setToast] = useState('')

  const working = draft ?? catalog
  const hasUnsaved =
    draft !== null && JSON.stringify(draft) !== JSON.stringify(catalog)

  useEffect(() => {
    if (!hasUnsaved) return
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [hasUnsaved])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2800)
  }

  function login(e: React.FormEvent) {
    e.preventDefault()
    if (password === catalog.brand.adminPassword) {
      setAdminAuthed(true)
      setAuthed(true)
      setDraft(structuredClone(catalog))
      setError('')
    } else {
      setError('Wrong password')
    }
  }

  function logout() {
    setAdminAuthed(false)
    setAuthed(false)
    setDraft(null)
  }

  function ensureDraft(): Catalog {
    if (draft) return draft
    const d = structuredClone(catalog)
    setDraft(d)
    return d
  }

  function patch(mutator: (c: Catalog) => void) {
    const next = structuredClone(ensureDraft())
    mutator(next)
    setDraft(next)
  }

  function handleSave() {
    if (!draft) {
      showToast('No changes')
      return
    }
    const withLog = pushActivity(draft, 'Catalog saved — shop updated')
    save(withLog)
    setDraft(withLog)
    showToast('Saved — shop updated in this browser')
  }

  function handleExport() {
    exportJson(working)
    showToast(
      hasUnsaved
        ? 'Exported draft (also click Save for this browser)'
        : 'Exported catalog.json — upload for live site',
    )
  }

  if (!authed) {
    return (
      <div
        className="flex min-h-[100svh] items-center justify-center bg-mist px-4 py-10"
        style={{
          paddingTop: 'max(2.5rem, env(safe-area-inset-top))',
          paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom))',
        }}
      >
        <form
          onSubmit={login}
          className="sheet-panel w-full max-w-sm rounded-3xl border border-line bg-white p-6 shadow-sm sm:p-8"
        >
          <p className="hero-enter text-xs font-semibold uppercase tracking-[0.25em] text-pink">
            Ring Nepal
          </p>
          <h1 className="hero-enter hero-enter-delay-1 mt-2 text-2xl font-semibold text-ink">
            Admin login
          </h1>
          <p className="hero-enter hero-enter-delay-2 mt-2 text-sm text-stone">
            Dashboard, stock, products, and shop settings.
          </p>
          <label className="hero-enter hero-enter-delay-3 mt-6 block text-xs font-semibold uppercase tracking-wider text-stone">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input mt-2 w-full rounded-xl border border-line bg-blush px-4 py-3.5 text-base text-ink outline-none focus:border-pink sm:text-sm"
              placeholder="Enter admin password"
              autoFocus
              autoComplete="current-password"
            />
          </label>
          {error && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="pressable hero-enter hero-enter-delay-4 mt-6 w-full min-h-12 rounded-full bg-ink py-3.5 text-sm font-semibold text-white hover:bg-ink-soft"
          >
            Sign in
          </button>
          <p className="mt-4 text-center text-xs text-stone">
            Change the password under Settings after first login.
          </p>
          <Link
            to="/"
            className="mt-4 block min-h-10 text-center text-sm text-pink hover:underline"
          >
            ← Back to shop
          </Link>
        </form>
      </div>
    )
  }

  const tabs: { id: Tab; label: string; short: string }[] = [
    { id: 'dashboard', label: 'Dashboard', short: 'Home' },
    { id: 'products', label: 'Products', short: 'Products' },
    { id: 'inventory', label: 'Inventory', short: 'Stock' },
    { id: 'showreel', label: 'Videos', short: 'Videos' },
    { id: 'stores', label: 'Stores', short: 'Stores' },
    { id: 'brand', label: 'Settings', short: 'Settings' },
  ]

  return (
    <div
      className="min-h-[100svh] bg-mist"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <header
        className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-md"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-pink sm:text-xs">
              Admin
            </p>
            <h1 className="truncate text-base font-semibold text-ink sm:text-lg">
              Ring Nepal
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {hasUnsaved && (
              <span className="hidden rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold text-amber-900 sm:inline-flex sm:px-3 sm:py-1.5 sm:text-[11px]">
                Unsaved
              </span>
            )}
            <Link
              to="/"
              target="_blank"
              className="pressable hidden min-h-10 items-center rounded-full border border-line px-3 py-2 text-xs font-semibold text-ink hover:bg-blush sm:inline-flex"
            >
              View shop
            </Link>
            <button
              type="button"
              onClick={handleExport}
              className="pressable inline-flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-full border border-line px-2.5 py-2 text-xs font-semibold text-ink hover:bg-blush sm:px-3"
              aria-label="Export catalog"
            >
              <Download className="size-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={`pressable inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-white hover:bg-ink-soft sm:px-4 ${
                hasUnsaved ? 'bg-pink-deep shadow-md shadow-pink/25' : 'bg-ink'
              }`}
            >
              <Save className="size-3.5" />
              <span>Save</span>
            </button>
            <button
              type="button"
              onClick={logout}
              className="pressable inline-flex min-h-10 min-w-10 items-center justify-center rounded-full px-2 py-2 text-xs font-semibold text-stone hover:bg-blush hover:text-ink sm:gap-1.5 sm:px-3"
              aria-label="Log out"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>

        {/* Tabs — swipeable chips */}
        <div className="no-scrollbar mx-auto flex max-w-6xl gap-1.5 overflow-x-auto px-3 pb-2.5 sm:gap-1 sm:px-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`chip shrink-0 rounded-full px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wider sm:px-4 sm:text-xs ${
                tab === t.id
                  ? 'bg-ink text-white shadow-sm'
                  : 'border border-line bg-white text-stone hover:text-ink'
              }`}
            >
              <span className="sm:hidden">{t.short}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>
      </header>

      {toast && (
        <div
          className="sheet-panel fixed left-1/2 z-50 max-w-[min(92vw,24rem)] -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-center text-sm text-white shadow-lg"
          style={{
            bottom: 'max(1.25rem, calc(env(safe-area-inset-bottom, 0px) + 4.5rem))',
          }}
          role="status"
        >
          {toast}
        </div>
      )}

      <main className="mx-auto max-w-6xl px-3 py-5 sm:px-4 sm:py-8">
        {hasUnsaved && (
          <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm text-amber-950 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-4">
            <p className="text-xs leading-relaxed sm:text-sm">
              Unsaved edits. Tap <strong>Save</strong> so the shop updates on this
              device.
            </p>
            <button
              type="button"
              onClick={handleSave}
              className="pressable min-h-10 shrink-0 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white"
            >
              Save now
            </button>
          </div>
        )}

        <div key={tab} className="hero-enter">
          {tab === 'dashboard' && (
            <DashboardTab
              catalog={working}
              onGo={(t) => setTab(t)}
              onExport={handleExport}
            />
          )}
          {tab === 'products' && (
            <ProductsTab
              products={working.bestsellers}
              defaultLow={working.brand.defaultLowStockAt}
              whatsapp={working.brand.whatsapp}
              onChange={(bestsellers) =>
                patch((c) => {
                  c.bestsellers = bestsellers
                })
              }
              onToast={showToast}
            />
          )}
          {tab === 'inventory' && (
            <InventoryTab
              products={working.bestsellers}
              onChange={(bestsellers) =>
                patch((c) => {
                  c.bestsellers = bestsellers
                })
              }
            />
          )}
          {tab === 'showreel' && (
            <ShowreelTab
              items={working.showreel}
              onChange={(showreel) =>
                patch((c) => {
                  c.showreel = showreel
                })
              }
              onToast={showToast}
            />
          )}
          {tab === 'stores' && (
            <StoresTab
              stores={working.stores}
              onChange={(stores) =>
                patch((c) => {
                  c.stores = stores
                })
              }
            />
          )}
          {tab === 'brand' && (
            <BrandTab
              catalog={working}
              onChange={(next) => setDraft(next)}
              onReset={() => {
                if (
                  confirm(
                    'Reset all admin data to defaults? This clears browser saves.',
                  )
                ) {
                  resetToDefault()
                  setDraft(null)
                  showToast('Reset to defaults')
                }
              }}
            />
          )}
        </div>
      </main>

      {/* Mobile sticky save bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-3 py-2.5 backdrop-blur-md sm:hidden"
        style={{
          paddingBottom: 'max(0.65rem, env(safe-area-inset-bottom, 0px))',
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center gap-2">
          <Link
            to="/"
            className="pressable inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-line text-xs font-semibold text-ink"
          >
            Shop
          </Link>
          <button
            type="button"
            onClick={handleSave}
            className={`pressable inline-flex min-h-11 flex-[2] items-center justify-center gap-1.5 rounded-full text-xs font-semibold text-white ${
              hasUnsaved ? 'bg-pink-deep' : 'bg-ink'
            }`}
          >
            <Save className="size-4" />
            {hasUnsaved ? 'Save changes' : 'Saved'}
          </button>
        </div>
      </div>

      {/* Spacer so content isn't hidden behind mobile save bar */}
      <div className="h-20 sm:hidden" aria-hidden />
    </div>
  )
}

/* ─── Dashboard ─── */

function DashboardTab({
  catalog,
  onGo,
  onExport,
}: {
  catalog: Catalog
  onGo: (t: Tab) => void
  onExport: () => void
}) {
  const stats = useMemo(() => {
    const products = catalog.bestsellers
    const active = products.filter((p) => p.active)
    const tracked = active.filter((p) => p.trackStock)
    const out = tracked.filter((p) => getStockStatus(p) === 'out')
    const low = tracked.filter((p) => getStockStatus(p) === 'low')
    const ok = tracked.filter((p) => getStockStatus(p) === 'ok')
    const units = tracked.reduce((s, p) => s + Math.max(0, p.stock), 0)
    const noPhoto = active.filter((p) => !p.image).length
    return {
      total: products.length,
      active: active.length,
      hidden: products.length - active.length,
      out: out.length,
      low: low.length,
      ok: ok.length,
      units,
      stores: catalog.stores.length,
      videos: catalog.showreel.length,
      lowList: low,
      outList: out,
      noPhoto,
    }
  }, [catalog])

  return (
    <div className="space-y-5 sm:space-y-8">
      <div>
        <h2 className="flex items-center gap-2 text-base font-semibold text-ink sm:text-lg">
          <LayoutDashboard className="size-5 shrink-0" />
          Overview
        </h2>
        <p className="mt-1 text-xs text-stone sm:text-sm">
          Last update: {new Date(catalog.updatedAt).toLocaleString()}
        </p>
      </div>

      <div className="card-lift rounded-2xl border border-line bg-white p-4 sm:p-5">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
          <CheckCircle2 className="size-4 text-pink" />
          Daily shop checklist
        </h3>
        <ol className="mt-3 space-y-2.5 text-sm text-ink-soft">
          <li className="flex gap-2">
            <span className="font-semibold text-pink">1.</span>
            <span>
              <button
                type="button"
                className="font-semibold text-ink underline"
                onClick={() => onGo('inventory')}
              >
                Inventory
              </button>{' '}
              — mark sold-out pieces 0 so customers don’t order empty stock.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-pink">2.</span>
            <span>
              <button
                type="button"
                className="font-semibold text-ink underline"
                onClick={() => onGo('products')}
              >
                Products
              </button>{' '}
              — add drops with photo + price, and tick{' '}
              <strong className="text-pink">Just arrived</strong>.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-pink">3.</span>
            <span>
              Tap <strong>Save</strong> — shop updates immediately on this device.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-pink">4.</span>
            <span>
              After big edits:{' '}
              <button
                type="button"
                className="font-semibold text-ink underline"
                onClick={onExport}
              >
                Export JSON
              </button>{' '}
              for go-live.
            </span>
          </li>
        </ol>
        {stats.noPhoto > 0 && (
          <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-950">
            {stats.noPhoto} active product(s) missing a photo.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <StatCard
          label="Active products"
          value={String(stats.active)}
          sub={`${stats.hidden} hidden`}
          onClick={() => onGo('products')}
        />
        <StatCard
          label="Units in stock"
          value={String(stats.units)}
          sub={`${stats.ok} healthy SKUs`}
          onClick={() => onGo('inventory')}
        />
        <StatCard
          label="Low stock"
          value={String(stats.low)}
          sub="Need restock"
          alert={stats.low > 0}
          onClick={() => onGo('inventory')}
        />
        <StatCard
          label="Out of stock"
          value={String(stats.out)}
          sub="Sold out"
          alert={stats.out > 0}
          onClick={() => onGo('inventory')}
        />
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        <StatCard
          label="Stores"
          value={String(stats.stores)}
          icon={<StoreIcon className="size-3.5 sm:size-4" />}
          onClick={() => onGo('stores')}
        />
        <StatCard
          label="Videos"
          value={String(stats.videos)}
          onClick={() => onGo('showreel')}
        />
        <StatCard
          label="Stock badges"
          value={catalog.brand.showStockOnSite ? 'ON' : 'OFF'}
          sub="Settings"
          onClick={() => onGo('brand')}
        />
      </div>

      {(stats.lowList.length > 0 || stats.outList.length > 0) && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-950">
            <AlertTriangle className="size-4 shrink-0" />
            Stock alerts
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-amber-950/90">
            {stats.outList.map((p) => (
              <li key={p.id} className="flex justify-between gap-2">
                <span className="min-w-0 truncate">{p.name}</span>
                <span className="shrink-0 font-semibold">Out</span>
              </li>
            ))}
            {stats.lowList.map((p) => (
              <li key={p.id} className="flex justify-between gap-2">
                <span className="min-w-0 truncate">{p.name}</span>
                <span className="shrink-0 font-semibold">{p.stock} left</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => onGo('inventory')}
            className="mt-4 min-h-10 text-xs font-semibold uppercase tracking-wider text-ink underline"
          >
            Manage inventory →
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-line bg-white p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-ink">Recent activity</h3>
        <ul className="mt-3 space-y-2">
          {(catalog.activity || []).slice(0, 8).map((a) => (
            <li
              key={a.id}
              className="flex flex-col gap-0.5 border-b border-line/60 py-2.5 text-sm last:border-0 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-2"
            >
              <span className="text-ink-soft">{a.message}</span>
              <span className="text-xs text-stone">
                {new Date(a.at).toLocaleString()}
              </span>
            </li>
          ))}
          {!catalog.activity?.length && (
            <li className="text-sm text-stone">No activity yet.</li>
          )}
        </ul>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={() => onGo('products')}
          className="pressable min-h-11 rounded-full bg-ink px-4 py-2.5 text-xs font-semibold text-white"
        >
          + Add product
        </button>
        <button
          type="button"
          onClick={() => onGo('inventory')}
          className="pressable min-h-11 rounded-full border border-line bg-white px-4 py-2.5 text-xs font-semibold text-ink"
        >
          Adjust stock
        </button>
        <button
          type="button"
          onClick={onExport}
          className="pressable inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-line bg-white px-4 py-2.5 text-xs font-semibold text-ink"
        >
          <Download className="size-3.5" />
          Export for live site
        </button>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  sub,
  alert,
  onClick,
  icon,
}: {
  label: string
  value: string
  sub?: string
  alert?: boolean
  onClick?: () => void
  icon?: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`card-lift min-h-[5.5rem] rounded-2xl border p-3 text-left sm:min-h-0 sm:p-4 ${
        alert ? 'border-amber-300 bg-amber-50' : 'border-line bg-white'
      }`}
    >
      <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-stone sm:gap-1.5 sm:text-[11px]">
        {icon}
        <span className="line-clamp-2">{label}</span>
      </p>
      <p className="mt-1.5 text-2xl font-semibold text-ink sm:mt-2 sm:text-3xl">
        {value}
      </p>
      {sub && <p className="mt-0.5 text-[11px] text-stone sm:mt-1 sm:text-xs">{sub}</p>}
    </button>
  )
}

/* ─── Products ─── */

function ProductsTab({
  products,
  defaultLow,
  whatsapp,
  onChange,
  onToast,
}: {
  products: Product[]
  defaultLow: number
  whatsapp: string
  onChange: (p: Product[]) => void
  onToast: (m: string) => void
}) {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<
    'all' | 'active' | 'hidden' | 'low' | 'out' | 'new'
  >('all')

  function addProduct() {
    onChange([
      {
        id: uid('p'),
        name: 'New product',
        meta: 'Jewelry',
        price: 'Rs. 0',
        image: '',
        active: true,
        sku: '',
        stock: 10,
        lowStockAt: defaultLow,
        trackStock: true,
        isNew: true,
      },
      ...products,
    ])
  }

  const visible = useMemo(() => {
    const query = q.trim().toLowerCase()
    return products.filter((p) => {
      if (filter === 'active' && !p.active) return false
      if (filter === 'hidden' && p.active) return false
      if (filter === 'low' && getStockStatus(p) !== 'low') return false
      if (filter === 'out' && getStockStatus(p) !== 'out') return false
      if (filter === 'new' && !p.isNew) return false
      if (!query) return true
      return (
        p.name.toLowerCase().includes(query) ||
        p.meta.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.price.toLowerCase().includes(query)
      )
    })
  }, [products, q, filter])

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-ink sm:text-lg">Products</h2>
          <p className="mt-0.5 text-xs text-stone sm:text-sm">
            Toggle <strong>Just arrived</strong> so new drops show on the shop
            homepage.
          </p>
        </div>
        <button
          type="button"
          onClick={addProduct}
          className="pressable inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-xs font-semibold text-white hover:bg-ink-soft sm:w-auto"
        >
          <Plus className="size-3.5" />
          Add product
        </button>
      </div>

      <div className="mb-3 space-y-2.5 sm:mb-4 sm:space-y-3">
        <label className="relative block min-w-0 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, category, SKU…"
            enterKeyHint="search"
            className="admin-input w-full rounded-xl border border-line bg-white py-3 pl-9 pr-3 text-base outline-none focus:border-pink sm:py-2.5 sm:text-sm"
          />
        </label>
        <div className="no-scrollbar -mx-0.5 flex gap-1.5 overflow-x-auto px-0.5 pb-0.5">
          {(
            [
              ['all', 'All'],
              ['new', 'Just arrived'],
              ['active', 'On shop'],
              ['hidden', 'Hidden'],
              ['low', 'Low'],
              ['out', 'Out'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`chip shrink-0 rounded-full px-3 py-2 text-[11px] font-semibold ${
                filter === id
                  ? 'bg-ink text-white shadow-sm'
                  : 'border border-line bg-white text-stone'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-3 text-xs text-stone">
        {visible.length} of {products.length} products
      </p>

      <div className="space-y-3 sm:space-y-4">
        {visible.map((p) => (
          <ProductEditor
            key={p.id}
            product={p}
            whatsapp={whatsapp}
            onChange={(next) =>
              onChange(products.map((x) => (x.id === p.id ? next : x)))
            }
            onDelete={() => {
              if (confirm(`Delete “${p.name}”?`)) {
                onChange(products.filter((x) => x.id !== p.id))
              }
            }}
            onToast={onToast}
          />
        ))}
        {!visible.length && (
          <p className="rounded-2xl border border-dashed border-line bg-white p-8 text-center text-sm text-stone">
            No products match this search.
          </p>
        )}
      </div>
    </div>
  )
}

function ProductEditor({
  product: p,
  whatsapp,
  onChange,
  onDelete,
  onToast,
}: {
  product: Product
  whatsapp: string
  onChange: (p: Product) => void
  onDelete: () => void
  onToast: (m: string) => void
}) {
  const preview = useResolvedMedia(p.image)

  async function copyOrderText() {
    const text = buildOrderMessage({
      name: p.name,
      price: p.price,
      stock: p.stock,
      trackStock: p.trackStock,
      image: p.image,
      sku: p.sku || undefined,
      category: p.meta || undefined,
    })
    try {
      await navigator.clipboard.writeText(text)
      onToast('Order message copied — paste into WhatsApp / IG')
    } catch {
      onToast('Could not copy — select text manually')
    }
  }

  return (
    <div className="card-lift grid gap-4 rounded-2xl border border-line bg-white p-3.5 sm:p-4 md:grid-cols-[140px_1fr] lg:grid-cols-[160px_1fr_auto]">
      <MediaDropzone
        kind="image"
        value={p.image}
        previewUrl={preview}
        label="Product photo"
        className="mx-auto w-full max-w-[220px] md:mx-0 md:max-w-none"
        onUploaded={(image) => {
          onChange({ ...p, image })
          onToast('Photo ready — click Save')
        }}
      />
      <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-2">
        <Field label="Name" value={p.name} onChange={(name) => onChange({ ...p, name })} />
        <Field label="Category" value={p.meta} onChange={(meta) => onChange({ ...p, meta })} />
        <Field label="Price" value={p.price} onChange={(price) => onChange({ ...p, price })} />
        <Field label="SKU (optional)" value={p.sku} onChange={(sku) => onChange({ ...p, sku })} />
        <NumField
          label="Stock qty"
          value={p.stock}
          onChange={(stock) => onChange({ ...p, stock: Math.max(0, stock) })}
        />
        <NumField
          label="Low stock at"
          value={p.lowStockAt}
          onChange={(lowStockAt) =>
            onChange({ ...p, lowStockAt: Math.max(0, lowStockAt) })
          }
        />
        <label className="flex min-h-11 items-center gap-2.5 text-sm text-ink sm:col-span-2">
          <input
            type="checkbox"
            className="size-4 accent-pink"
            checked={p.trackStock}
            onChange={(e) => onChange({ ...p, trackStock: e.target.checked })}
          />
          Track stock & show on customer site
        </label>
        <label className="flex min-h-11 items-start gap-2.5 text-sm text-ink sm:col-span-2">
          <input
            type="checkbox"
            className="mt-0.5 size-4 accent-pink"
            checked={p.isNew === true}
            onChange={(e) => onChange({ ...p, isNew: e.target.checked })}
          />
          <span>
            <span className="font-semibold text-pink">Just arrived</span>
            {' — '}show in New section on homepage
          </span>
        </label>
        <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
          <AdminStockChip product={p} />
          <button
            type="button"
            onClick={() => void copyOrderText()}
            className="pressable inline-flex min-h-9 items-center gap-1 rounded-full border border-line px-2.5 py-1.5 text-[11px] font-semibold text-ink hover:bg-blush"
            title="Copy the same text customers send on Order"
          >
            <ClipboardCopy className="size-3" />
            Copy WA text
          </button>
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                buildOrderMessage({
                  name: p.name,
                  price: p.price,
                  stock: p.stock,
                  trackStock: p.trackStock,
                  image: p.image,
                  sku: p.sku || undefined,
                  category: p.meta || undefined,
                }),
              )}`}
              target="_blank"
              rel="noreferrer"
              className="min-h-9 text-[11px] font-semibold text-pink-deep hover:underline"
            >
              Test order link →
            </a>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 md:flex md:flex-col md:items-stretch lg:col-auto">
        <button
          type="button"
          onClick={() => onChange({ ...p, active: !p.active })}
          className={`pressable inline-flex min-h-11 items-center justify-center gap-1 rounded-full px-3 py-2 text-xs font-semibold ${
            p.active ? 'bg-emerald-50 text-emerald-800' : 'bg-stone/10 text-stone'
          }`}
        >
          {p.active ? (
            <>
              <Eye className="size-3.5" /> On shop
            </>
          ) : (
            <>
              <EyeOff className="size-3.5" /> Hidden
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="pressable inline-flex min-h-11 items-center justify-center gap-1 rounded-full bg-red-50 px-3 py-2 text-xs font-semibold text-red-700"
        >
          <Trash2 className="size-3.5" />
          Delete
        </button>
      </div>
    </div>
  )
}

/* ─── Inventory ─── */

function InventoryTab({
  products,
  onChange,
}: {
  products: Product[]
  onChange: (p: Product[]) => void
}) {
  const sorted = [...products].sort((a, b) => {
    const rank = (p: Product) => {
      const s = getStockStatus(p)
      if (s === 'out') return 0
      if (s === 'low') return 1
      if (s === 'ok') return 2
      return 3
    }
    return rank(a) - rank(b)
  })

  function setStock(id: string, stock: number) {
    onChange(
      products.map((p) =>
        p.id === id ? { ...p, stock: Math.max(0, stock) } : p,
      ),
    )
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="flex items-center gap-2 text-base font-semibold text-ink sm:text-lg">
          <Package className="size-5 shrink-0" />
          Inventory
        </h2>
        <p className="mt-1 text-xs text-stone sm:text-sm">
          Quick +/- stock. Low & out items sort to the top. Save when done.
        </p>
      </div>

      {/* Mobile: card list */}
      <div className="space-y-2.5 sm:hidden">
        {sorted.map((p) => (
          <div
            key={p.id}
            className="card-lift rounded-2xl border border-line bg-white p-3.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">{p.name}</p>
                <p className="text-xs text-stone">
                  {p.meta}
                  {p.sku ? ` · ${p.sku}` : ''}
                </p>
              </div>
              <AdminStockChip product={p} />
            </div>
            {p.trackStock ? (
              <div className="mt-3 flex items-center justify-center gap-2">
                <button
                  type="button"
                  className="pressable inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-line hover:bg-blush"
                  onClick={() => setStock(p.id, p.stock - 1)}
                  aria-label={`Decrease ${p.name}`}
                >
                  <Minus className="size-4" />
                </button>
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={p.stock}
                  onChange={(e) => setStock(p.id, Number(e.target.value) || 0)}
                  className="admin-input w-16 rounded-xl border border-line bg-blush/40 px-2 py-2.5 text-center text-base font-semibold"
                />
                <button
                  type="button"
                  className="pressable inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-line hover:bg-blush"
                  onClick={() => setStock(p.id, p.stock + 1)}
                  aria-label={`Increase ${p.name}`}
                >
                  <Plus className="size-4" />
                </button>
              </div>
            ) : (
              <p className="mt-2 text-xs text-stone">Stock tracking off</p>
            )}
          </div>
        ))}
      </div>

      {/* Desktop / tablet: table */}
      <div className="hidden overflow-hidden rounded-2xl border border-line bg-white sm:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="border-b border-line bg-blush/50 text-[11px] uppercase tracking-wider text-stone">
              <tr>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">SKU</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Qty</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => (
                <tr key={p.id} className="border-b border-line/70 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{p.name}</p>
                    <p className="text-xs text-stone">{p.meta}</p>
                  </td>
                  <td className="px-4 py-3 text-stone">{p.sku || '—'}</td>
                  <td className="px-4 py-3">
                    <AdminStockChip product={p} />
                  </td>
                  <td className="px-4 py-3">
                    {p.trackStock ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="pressable rounded-lg border border-line p-2 hover:bg-blush"
                          onClick={() => setStock(p.id, p.stock - 1)}
                          aria-label="Decrease"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <input
                          type="number"
                          min={0}
                          value={p.stock}
                          onChange={(e) =>
                            setStock(p.id, Number(e.target.value) || 0)
                          }
                          className="w-14 rounded-lg border border-line bg-blush/40 px-2 py-1.5 text-center text-sm font-semibold"
                        />
                        <button
                          type="button"
                          className="pressable rounded-lg border border-line p-2 hover:bg-blush"
                          onClick={() => setStock(p.id, p.stock + 1)}
                          aria-label="Increase"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-stone">Off</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ─── Showreel / Stores / Brand ─── */

function ShowreelTab({
  items,
  onChange,
  onToast,
}: {
  items: ShowreelItem[]
  onChange: (i: ShowreelItem[]) => void
  onToast: (m: string) => void
}) {
  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-ink sm:text-lg">
            Video showreel
          </h2>
          <p className="mt-0.5 text-xs text-stone sm:text-sm">
            Drag & drop video — appears on customer homepage strip.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...items,
              {
                id: uid('sr'),
                src: '',
                name: 'New look',
                tag: 'New',
                price: 'From Rs. 0',
              },
            ])
          }
          className="pressable inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-xs font-semibold text-white sm:w-auto"
        >
          <Plus className="size-3.5" />
          Add card
        </button>
      </div>
      <div className="space-y-3 sm:space-y-4">
        {items.map((item) => (
          <ShowreelEditor
            key={item.id}
            item={item}
            onChange={(next) =>
              onChange(items.map((x) => (x.id === item.id ? next : x)))
            }
            onDelete={() => onChange(items.filter((x) => x.id !== item.id))}
            onToast={onToast}
          />
        ))}
      </div>
    </div>
  )
}

function ShowreelEditor({
  item,
  onChange,
  onDelete,
  onToast,
}: {
  item: ShowreelItem
  onChange: (i: ShowreelItem) => void
  onDelete: () => void
  onToast: (m: string) => void
}) {
  const preview = useResolvedMedia(item.src)
  return (
    <div className="card-lift grid gap-4 rounded-2xl border border-line bg-white p-3.5 sm:p-4 md:grid-cols-[1fr_1fr]">
      <MediaDropzone
        kind="video"
        value={item.src}
        previewUrl={preview}
        label="Product video"
        onUploaded={(src) => {
          onChange({ ...item, src })
          onToast('Video ready — click Save')
        }}
      />
      <div className="grid content-start gap-2.5">
        <Field label="Name" value={item.name} onChange={(name) => onChange({ ...item, name })} />
        <Field label="Tag" value={item.tag} onChange={(tag) => onChange({ ...item, tag })} />
        <Field label="Price" value={item.price} onChange={(price) => onChange({ ...item, price })} />
        <button
          type="button"
          onClick={onDelete}
          className="pressable mt-1 inline-flex min-h-11 w-full items-center justify-center gap-1 rounded-full bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 sm:w-fit"
        >
          <Trash2 className="size-3.5" />
          Remove
        </button>
      </div>
    </div>
  )
}

function StoresTab({
  stores,
  onChange,
}: {
  stores: Store[]
  onChange: (s: Store[]) => void
}) {
  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-ink sm:text-lg">Stores</h2>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...stores,
              { id: uid('s'), name: 'New store', phone: '', note: '' },
            ])
          }
          className="pressable inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-xs font-semibold text-white sm:w-auto"
        >
          <Plus className="size-3.5" />
          Add store
        </button>
      </div>
      <div className="space-y-3">
        {stores.map((s) => (
          <div
            key={s.id}
            className="card-lift grid gap-2.5 rounded-2xl border border-line bg-white p-3.5 sm:grid-cols-3 sm:gap-2 sm:p-4"
          >
            <Field
              label="Name"
              value={s.name}
              onChange={(name) =>
                onChange(stores.map((x) => (x.id === s.id ? { ...x, name } : x)))
              }
            />
            <Field
              label="Phone"
              value={s.phone}
              onChange={(phone) =>
                onChange(stores.map((x) => (x.id === s.id ? { ...x, phone } : x)))
              }
            />
            <Field
              label="Note"
              value={s.note}
              onChange={(note) =>
                onChange(stores.map((x) => (x.id === s.id ? { ...x, note } : x)))
              }
            />
            <button
              type="button"
              onClick={() => onChange(stores.filter((x) => x.id !== s.id))}
              className="pressable inline-flex min-h-11 w-full items-center justify-center gap-1 rounded-full bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 sm:col-span-3 sm:w-fit"
            >
              <Trash2 className="size-3.5" />
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function BrandTab({
  catalog,
  onChange,
  onReset,
}: {
  catalog: Catalog
  onChange: (c: Catalog) => void
  onReset: () => void
}) {
  const b = catalog.brand
  return (
    <div className="card-lift max-w-xl space-y-4 rounded-2xl border border-line bg-white p-4 sm:p-6">
      <h2 className="text-base font-semibold text-ink sm:text-lg">Settings</h2>
      <Field
        label="WhatsApp (country code, no +)"
        value={b.whatsapp}
        onChange={(whatsapp) =>
          onChange({ ...catalog, brand: { ...b, whatsapp } })
        }
      />
      <Field
        label="Delivery note"
        value={b.deliveryNote}
        onChange={(deliveryNote) =>
          onChange({ ...catalog, brand: { ...b, deliveryNote } })
        }
      />
      <Field
        label="Instagram URL"
        value={b.instagram}
        onChange={(instagram) =>
          onChange({ ...catalog, brand: { ...b, instagram } })
        }
      />
      <Field
        label="Daraz URL"
        value={b.daraz}
        onChange={(daraz) => onChange({ ...catalog, brand: { ...b, daraz } })}
      />
      <Field
        label="Admin password"
        value={b.adminPassword}
        onChange={(adminPassword) =>
          onChange({ ...catalog, brand: { ...b, adminPassword } })
        }
      />
      <NumField
        label="Default low-stock threshold (new products)"
        value={b.defaultLowStockAt}
        onChange={(defaultLowStockAt) =>
          onChange({
            ...catalog,
            brand: { ...b, defaultLowStockAt: Math.max(0, defaultLowStockAt) },
          })
        }
      />
      <label className="flex min-h-11 items-start gap-2.5 text-sm text-ink">
        <input
          type="checkbox"
          className="mt-0.5 size-4 accent-pink"
          checked={b.showStockOnSite}
          onChange={(e) =>
            onChange({
              ...catalog,
              brand: { ...b, showStockOnSite: e.target.checked },
            })
          }
        />
        Show stock badges on customer website (“Only 3 left”, “Out of stock”)
      </label>
      <Field
        label="Hero line 1"
        value={catalog.hero.line1}
        onChange={(line1) =>
          onChange({ ...catalog, hero: { ...catalog.hero, line1 } })
        }
      />
      <Field
        label="Hero line 2"
        value={catalog.hero.line2}
        onChange={(line2) =>
          onChange({ ...catalog, hero: { ...catalog.hero, line2 } })
        }
      />
      <button
        type="button"
        onClick={onReset}
        className="pressable min-h-11 w-full rounded-full border border-red-200 px-4 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-50 sm:w-auto"
      >
        Reset all data to defaults
      </button>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="admin-input mt-1.5 w-full rounded-xl border border-line bg-blush/50 px-3 py-3 text-base font-normal normal-case tracking-normal text-ink outline-none focus:border-pink sm:mt-1 sm:py-2 sm:text-sm"
      />
    </label>
  )
}

function NumField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone">
      {label}
      <input
        type="number"
        min={0}
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="admin-input mt-1.5 w-full rounded-xl border border-line bg-blush/50 px-3 py-3 text-base font-normal normal-case tracking-normal text-ink outline-none focus:border-pink sm:mt-1 sm:py-2 sm:text-sm"
      />
    </label>
  )
}
