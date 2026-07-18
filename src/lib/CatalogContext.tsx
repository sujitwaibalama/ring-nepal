import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { defaultCatalog } from '../data/defaultCatalog'
import type { Catalog } from '../data/types'
import { waLink as buildWa } from '../data/types'
import {
  clearLocalCatalog,
  downloadCatalogJson,
  loadCatalog,
  saveCatalog,
} from './catalogStore'

type CatalogContextValue = {
  catalog: Catalog
  loading: boolean
  /** Active bestsellers only (for storefront) */
  products: Catalog['bestsellers']
  save: (next: Catalog) => void
  resetToDefault: () => void
  exportJson: (catalogOverride?: Catalog) => void
  reload: () => Promise<void>
  wa: (message?: string) => string
}

const CatalogContext = createContext<CatalogContextValue | null>(null)

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<Catalog>(defaultCatalog)
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    setLoading(true)
    const data = await loadCatalog()
    setCatalog(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  const save = useCallback((next: Catalog) => {
    const stored = saveCatalog(next)
    setCatalog(stored)
  }, [])

  const resetToDefault = useCallback(() => {
    clearLocalCatalog()
    setCatalog(JSON.parse(JSON.stringify(defaultCatalog)) as typeof defaultCatalog)
  }, [])

  const exportJson = useCallback(
    (catalogOverride?: Catalog) => {
      downloadCatalogJson(catalogOverride ?? catalog)
    },
    [catalog],
  )

  const products = useMemo(
    () => catalog.bestsellers.filter((p) => p.active !== false),
    [catalog.bestsellers],
  )

  const wa = useCallback(
    (message?: string) => buildWa(catalog.brand.whatsapp, message),
    [catalog.brand.whatsapp],
  )

  const value = useMemo(
    () => ({
      catalog,
      loading,
      products,
      save,
      resetToDefault,
      exportJson,
      reload,
      wa,
    }),
    [
      catalog,
      loading,
      products,
      save,
      resetToDefault,
      exportJson,
      reload,
      wa,
    ],
  )

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  )
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used inside CatalogProvider')
  return ctx
}
