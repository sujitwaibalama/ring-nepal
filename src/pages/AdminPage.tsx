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
  const hasUnsaved = draft !== null && JSON.stringify(draft) !== JSON.stringify(catalog)

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
    // Export current working draft so unsaved edits are not lost from the file
    exportJson(working)
    showToast(
      hasUnsaved
        ? 'Exported draft (also click Save for this browser)'
        : 'Exported catalog.json — upload for live site',
    )
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mist px-4">
        <form
          onSubmit={login}
          className="w-full max-w-sm rounded-3xl border border-line bg-white p-8 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink">
            Ring Nepal
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-ink">Admin login</h1>
          <p className="mt-2 text-sm text-stone">
            Dashboard, stock, products, and shop settings.
          </p>
          <label className="mt-6 block text-xs font-semibold uppercase tracking-wider text-stone">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-blush px-4 py-3 text-sm text-ink outline-none focus:border-pink"
              placeholder="Enter admin password"
              autoFocus
            />
          </label>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-ink py-3 text-sm font-semibold text-white hover:bg-ink-soft"
          >
            Sign in
          </button>
          <p className="mt-4 text-center text-xs text-stone">
            Ask your developer for the password. Change it under Settings after first login.
          </p>
          <Link
            to="/"
            className="mt-4 block text-center text-sm text-pink hover:underline"
          >
            ← Back to shop
          </Link>
        </form>
      </div>
    )
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'products', label: 'Products' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'showreel', label: 'Videos' },
    { id: 'stores', label: 'Stores' },
    { id: 'brand', label: 'Settings' },
  ]

  return (
    <div className="min-h-screen bg-mist">
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink">
              Admin
            </p>
            <h1 className="text-lg font-semibold text-ink">Ring Nepal dashboard</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {hasUnsaved && (
              <span className="rounded-full bg-amber-100 px-3 py-1.5 text-[11px] font-semibold text-amber-900">
                Unsaved changes
              </span>
            )}
            <Link
              to="/"
              target="_blank"
              className="rounded-full border border-line px-3 py-2 text-xs font-semibold text-ink hover:bg-blush"
            >
              View shop
            </Link>
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-2 text-xs font-semibold text-ink hover:bg-blush"
            >
              <Download className="size-3.5" />
              Export
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white hover:bg-ink-soft ${
                hasUnsaved ? 'bg-pink-deep' : 'bg-ink'
              }`}
            >
              <Save className="size-3.5" />
              Save
            </button>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-stone hover:text-ink"
            >
              <LogOut className="size-3.5" />
              Log out
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                tab === t.id
                  ? 'bg-ink text-white'
                  : 'bg-white text-stone hover:text-ink'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 py-8">
        {hasUnsaved && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            <p>
              You have edits that are not saved yet. Click{' '}
              <strong>Save</strong> so the shop (this browser) updates.
            </p>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-white"
            >
              Save now
            </button>
          </div>
        )}
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
      </main>
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
    <div className="space-y-8">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
          <LayoutDashboard className="size-5" />
          Overview
        </h2>
        <p className="mt-1 text-sm text-stone">
          Last update: {new Date(catalog.updatedAt).toLocaleString()}
        </p>
      </div>

      {/* Daily workflow — solves “what do I do every morning?” */}
      <div className="rounded-2xl border border-line bg-white p-5">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
          <CheckCircle2 className="size-4 text-pink" />
          Daily shop checklist
        </h3>
        <ol className="mt-3 space-y-2 text-sm text-ink-soft">
          <li className="flex gap-2">
            <span className="font-semibold text-pink">1.</span>
            <span>
              <button type="button" className="font-semibold text-ink underline" onClick={() => onGo('inventory')}>
                Inventory
              </button>{' '}
              — mark sold-out pieces 0 so customers don’t order empty stock.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-pink">2.</span>
            <span>
              <button type="button" className="font-semibold text-ink underline" onClick={() => onGo('products')}>
                Products
              </button>{' '}
              — add drops with photo + price, and tick{' '}
              <strong className="text-pink">Just arrived</strong> so they appear
              in the New section (better than only posting on Instagram).
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-pink">3.</span>
            <span>
              Click <strong>Save</strong> (top right) — shop updates immediately on this device.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-pink">4.</span>
            <span>
              Before going live / after big edits:{' '}
              <button type="button" className="font-semibold text-ink underline" onClick={onExport}>
                Export JSON
              </button>{' '}
              and give the file to your developer to deploy.
            </span>
          </li>
        </ol>
        {stats.noPhoto > 0 && (
          <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-950">
            {stats.noPhoto} active product(s) missing a photo — customers trust photos more than names.
          </p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
          sub="Need restock soon"
          alert={stats.low > 0}
          onClick={() => onGo('inventory')}
        />
        <StatCard
          label="Out of stock"
          value={String(stats.out)}
          sub="Sold out on shop"
          alert={stats.out > 0}
          onClick={() => onGo('inventory')}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Stores"
          value={String(stats.stores)}
          icon={<StoreIcon className="size-4" />}
          onClick={() => onGo('stores')}
        />
        <StatCard
          label="Showreel videos"
          value={String(stats.videos)}
          onClick={() => onGo('showreel')}
        />
        <StatCard
          label="Show stock on shop"
          value={catalog.brand.showStockOnSite ? 'ON' : 'OFF'}
          sub="Settings → Brand"
          onClick={() => onGo('brand')}
        />
      </div>

      {(stats.lowList.length > 0 || stats.outList.length > 0) && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-950">
            <AlertTriangle className="size-4" />
            Stock alerts
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-amber-950/90">
            {stats.outList.map((p) => (
              <li key={p.id} className="flex justify-between gap-2">
                <span>{p.name}</span>
                <span className="font-semibold">Out of stock</span>
              </li>
            ))}
            {stats.lowList.map((p) => (
              <li key={p.id} className="flex justify-between gap-2">
                <span>{p.name}</span>
                <span className="font-semibold">Only {p.stock} left</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => onGo('inventory')}
            className="mt-4 text-xs font-semibold uppercase tracking-wider text-ink underline"
          >
            Manage inventory →
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-line bg-white p-5">
        <h3 className="text-sm font-semibold text-ink">Recent activity</h3>
        <ul className="mt-3 space-y-2">
          {(catalog.activity || []).slice(0, 8).map((a) => (
            <li
              key={a.id}
              className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line/60 py-2 text-sm last:border-0"
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

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onGo('products')}
          className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white"
        >
          + Add product
        </button>
        <button
          type="button"
          onClick={() => onGo('inventory')}
          className="rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-ink"
        >
          Adjust stock
        </button>
        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-ink"
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
      className={`rounded-2xl border p-4 text-left transition-colors hover:border-ink/20 ${
        alert ? 'border-amber-300 bg-amber-50' : 'border-line bg-white'
      }`}
    >
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone">
        {icon}
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
      {sub && <p className="mt-1 text-xs text-stone">{sub}</p>}
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
        // New products start in “Just arrived” so the drop is visible on the site
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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink">Products</h2>
          <p className="text-sm text-stone">
            Toggle <strong>Just arrived</strong> so new drops show on the shop
            homepage — customers see what’s new without only using Instagram.
          </p>
        </div>
        <button
          type="button"
          onClick={addProduct}
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white hover:bg-ink-soft"
        >
          <Plus className="size-3.5" />
          Add product
        </button>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative block min-w-0 flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, category, SKU…"
            className="w-full rounded-xl border border-line bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-pink"
          />
        </label>
        <div className="flex flex-wrap gap-1.5">
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
              className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                filter === id
                  ? 'bg-ink text-white'
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

      <div className="space-y-4">
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
    <div className="grid gap-4 rounded-2xl border border-line bg-white p-4 md:grid-cols-[160px_1fr_auto]">
      <MediaDropzone
        kind="image"
        value={p.image}
        previewUrl={preview}
        label="Product photo"
        onUploaded={(image) => {
          onChange({ ...p, image })
          onToast('Photo ready — click Save')
        }}
      />
      <div className="grid gap-2 sm:grid-cols-2">
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
        <label className="flex items-center gap-2 text-sm text-ink sm:col-span-2">
          <input
            type="checkbox"
            checked={p.trackStock}
            onChange={(e) => onChange({ ...p, trackStock: e.target.checked })}
          />
          Track stock & show on customer site
        </label>
        <label className="flex items-center gap-2 text-sm text-ink sm:col-span-2">
          <input
            type="checkbox"
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
            className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-[11px] font-semibold text-ink hover:bg-blush"
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
              className="text-[11px] font-semibold text-pink-deep hover:underline"
            >
              Test order link →
            </a>
          )}
        </div>
      </div>
      <div className="flex flex-row items-center gap-2 md:flex-col md:items-stretch">
        <button
          type="button"
          onClick={() => onChange({ ...p, active: !p.active })}
          className={`inline-flex items-center justify-center gap-1 rounded-full px-3 py-2 text-xs font-semibold ${
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
          className="inline-flex items-center justify-center gap-1 rounded-full bg-red-50 px-3 py-2 text-xs font-semibold text-red-700"
        >
          <Trash2 className="size-3.5" />
          Delete
        </button>
      </div>
    </div>
  )
}

/* ─── Inventory quick adjust ─── */

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
        <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
          <Package className="size-5" />
          Inventory
        </h2>
        <p className="mt-1 text-sm text-stone">
          Quick +/- stock. Low & out items sort to the top. Save when done.
        </p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-blush/50 text-[11px] uppercase tracking-wider text-stone">
            <tr>
              <th className="px-4 py-3 font-semibold">Product</th>
              <th className="hidden px-4 py-3 font-semibold sm:table-cell">
                SKU
              </th>
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
                <td className="hidden px-4 py-3 text-stone sm:table-cell">
                  {p.sku || '—'}
                </td>
                <td className="px-4 py-3">
                  <AdminStockChip product={p} />
                </td>
                <td className="px-4 py-3">
                  {p.trackStock ? (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="rounded-lg border border-line p-1.5 hover:bg-blush"
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
                        className="w-14 rounded-lg border border-line bg-blush/40 px-2 py-1 text-center text-sm font-semibold"
                      />
                      <button
                        type="button"
                        className="rounded-lg border border-line p-1.5 hover:bg-blush"
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
  )
}

/* ─── Showreel / Stores / Brand (same as before, tightened) ─── */

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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink">Video showreel</h2>
          <p className="text-sm text-stone">
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
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white"
        >
          <Plus className="size-3.5" />
          Add card
        </button>
      </div>
      <div className="space-y-4">
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
    <div className="grid gap-4 rounded-2xl border border-line bg-white p-4 md:grid-cols-[1fr_1fr]">
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
      <div className="grid gap-2 content-start">
        <Field label="Name" value={item.name} onChange={(name) => onChange({ ...item, name })} />
        <Field label="Tag" value={item.tag} onChange={(tag) => onChange({ ...item, tag })} />
        <Field label="Price" value={item.price} onChange={(price) => onChange({ ...item, price })} />
        <button
          type="button"
          onClick={onDelete}
          className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-red-50 px-3 py-2 text-xs font-semibold text-red-700"
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
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ink">Stores</h2>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...stores,
              { id: uid('s'), name: 'New store', phone: '', note: '' },
            ])
          }
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white"
        >
          <Plus className="size-3.5" />
          Add store
        </button>
      </div>
      <div className="space-y-3">
        {stores.map((s) => (
          <div
            key={s.id}
            className="grid gap-2 rounded-2xl border border-line bg-white p-4 sm:grid-cols-3"
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
              className="inline-flex w-fit items-center gap-1 rounded-full bg-red-50 px-3 py-2 text-xs font-semibold text-red-700"
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
    <div className="max-w-xl space-y-4 rounded-2xl border border-line bg-white p-6">
      <h2 className="text-lg font-semibold text-ink">Settings</h2>
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
      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
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
        className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
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
        className="mt-1 w-full rounded-xl border border-line bg-blush/50 px-3 py-2 text-sm font-normal normal-case tracking-normal text-ink outline-none focus:border-pink"
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
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-1 w-full rounded-xl border border-line bg-blush/50 px-3 py-2 text-sm font-normal normal-case tracking-normal text-ink outline-none focus:border-pink"
      />
    </label>
  )
}
