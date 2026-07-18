/**
 * Build a clear WhatsApp order message.
 * Includes a public photo URL when possible so WhatsApp can show a link preview.
 * Note: wa.me cannot attach files — only text (+ link previews for HTTPS images).
 */

export type OrderFulfillment = 'delivery' | 'pickup' | 'undecided'

export type OrderMessageInput = {
  name: string
  price: string
  /** Units left when stock is tracked */
  stock?: number
  trackStock?: boolean
  /** /images/..., https://..., or idb:/data: (not shareable) */
  image?: string
  /** Optional SKU for staff lookup */
  sku?: string
  /** Category / meta line */
  category?: string
  /** Preferred store for pickup or “near me” */
  preferredStore?: string
  fulfillment?: OrderFulfillment
  /** Extra free-text (size note, color, gift wrap) */
  note?: string
}

/** Paths that can be opened by the shop on another phone */
export function toPublicMediaUrl(src: string | undefined): string | null {
  if (!src) return null
  if (src.startsWith('https://') || src.startsWith('http://')) return src
  // Uploaded in-browser only — not on the public web
  if (
    src.startsWith('idb:') ||
    src.startsWith('data:') ||
    src.startsWith('blob:')
  ) {
    return null
  }
  if (src.startsWith('/')) {
    if (typeof window === 'undefined') return null
    // Absolute URL required for WhatsApp link preview after deploy
    return `${window.location.origin}${src}`
  }
  return null
}

export function buildOrderMessage(input: OrderMessageInput): string {
  const lines: string[] = [
    'Hi Ring Nepal, I want to buy:',
    '',
    `Product: ${input.name}`,
    `Price: ${input.price}`,
  ]

  if (input.category) {
    lines.push(`Category: ${input.category}`)
  }
  if (input.sku) {
    lines.push(`SKU: ${input.sku}`)
  }

  if (input.trackStock) {
    const n = input.stock ?? 0
    lines.push(n <= 0 ? 'Stock: Out of stock' : `Stock: ${n} left`)
  }

  if (input.fulfillment === 'delivery') {
    lines.push('Preference: Delivery')
  } else if (input.fulfillment === 'pickup') {
    lines.push(
      input.preferredStore
        ? `Preference: Pickup at ${input.preferredStore}`
        : 'Preference: Store pickup',
    )
  } else if (input.preferredStore) {
    lines.push(`Nearest / preferred store: ${input.preferredStore}`)
  }

  if (input.note?.trim()) {
    lines.push(`Note: ${input.note.trim()}`)
  }

  const photo = toPublicMediaUrl(input.image)
  if (photo) {
    lines.push('', 'Photo (tap to view):', photo)
  } else if (input.image) {
    // Admin-uploaded image lives only in this browser — ask them to check site
    const shop =
      typeof window !== 'undefined' ? `${window.location.origin}/#featured` : ''
    lines.push(
      '',
      'Photo: please check this product on our website',
      shop || '(open the shop bestsellers section)',
    )
  }

  lines.push('', 'Please confirm availability. Thank you!')
  return lines.join('\n')
}

/** Message when customer taps a specific store card */
export function buildStoreVisitMessage(storeName: string, note?: string): string {
  const lines = [
    'Hi Ring Nepal!',
    '',
    `I want to visit / ask about the ${storeName} store.`,
  ]
  if (note) lines.push(`Location note: ${note}`)
  lines.push('', 'Please share stock, hours, or directions. Thank you!')
  return lines.join('\n')
}

/** Generic shop inquiry with optional store */
export function buildGeneralShopMessage(preferredStore?: string): string {
  if (preferredStore) {
    return `Hi Ring Nepal, I want to shop! Preferred store: ${preferredStore}`
  }
  return 'Hi Ring Nepal, I want to shop!'
}
