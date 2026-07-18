import { MessageCircle } from 'lucide-react'
import { useCatalog } from '../lib/CatalogContext'

/** Always-visible mobile/desktop shortcut — cuts scroll friction to order */
export function WhatsAppFab() {
  const { wa } = useCatalog()

  return (
    <a
      href={wa('Hi Ring Nepal, I want to shop!')}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#25D366]/35 transition-transform hover:scale-[1.03] hover:bg-[#1ebe57] active:scale-95 md:bottom-8 md:right-8"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="size-5" />
      <span className="pr-0.5">Order</span>
    </a>
  )
}
