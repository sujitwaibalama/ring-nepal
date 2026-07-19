import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { useCatalog } from '../lib/CatalogContext'

/** Always-visible mobile/desktop shortcut — cuts scroll friction to order */
export function WhatsAppFab() {
  const { wa } = useCatalog()
  const [hidden, setHidden] = useState(false)

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
      className="safe-fab fixed z-40 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#25D366] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#25D366]/35 transition-transform hover:scale-[1.03] hover:bg-[#1ebe57] active:scale-95 md:bottom-8 md:right-8"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="size-5" />
      <span className="pr-0.5">Order</span>
    </a>
  )
}
