import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { useCatalog } from '../lib/CatalogContext'

/** Always-visible mobile/desktop shortcut — cuts scroll friction to order */
export function WhatsAppFab() {
  const { wa } = useCatalog()
  const [hidden, setHidden] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 600)
    return () => window.clearTimeout(t)
  }, [])

  // Hide when product sheet / menu body lock is active to avoid double green CTAs
  useEffect(() => {
    const check = () => {
      setHidden(
        document.body.style.overflow === 'hidden' ||
          document.body.dataset.modalOpen === 'true',
      )
    }
    check()
    const mo = new MutationObserver(check)
    mo.observe(document.body, {
      attributes: true,
      attributeFilter: ['style', 'data-modal-open'],
    })
    return () => mo.disconnect()
  }, [])

  if (hidden) return null

  return (
    <a
      href={wa('Hi Ring Nepal, I want to shop!')}
      target="_blank"
      rel="noreferrer"
      className={`safe-fab pressable fixed z-40 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#25D366] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#25D366]/35 hover:bg-[#1ebe57] md:bottom-8 md:right-8 ${
        ready ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      }`}
      style={{
        transition:
          'transform 0.45s cubic-bezier(0.34, 1.3, 0.64, 1), opacity 0.4s ease, background-color 0.25s ease',
      }}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="size-5" />
      <span className="pr-0.5">Order</span>
    </a>
  )
}
