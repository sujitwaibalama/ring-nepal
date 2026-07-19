/**
 * Ring Nepal — single place to edit business details before go-live.
 * Brand sells jewelry, accessories, beauty, perfume, gifts & more.
 */

export const brand = {
  name: 'Ring Nepal',
  nameNp: 'Ring नेपाल',
  tagline: 'Jewelry, beauty, perfume & cute gifts',
  estd: '2024',
  city: 'Kathmandu',
  storeCount: 8,
  instagram: 'https://www.instagram.com/rings.nepal/',
  instagramHandle: '@rings.nepal',
  daraz: 'https://www.daraz.com.np/shop/ghoptohs',
  /** Main sales line (New Baneshwor from Instagram bio) */
  whatsapp: '9779823770857',
  deliveryNote:
    'Kathmandu Valley 2–3 days · COD available · All-Nepal delivery on request',
}

/** Build WhatsApp deep link with optional prefilled message */
export function waLink(message?: string) {
  const base = `https://wa.me/${brand.whatsapp}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}

export const hero = {
  video: '/videos/hero.mp4?v=silver',
  poster: '/videos/hero-poster.jpg?v=silver',
  eyebrow: `${brand.storeCount} stores · Kathmandu & Lalitpur`,
  line1: 'Pretty little things',
  line2: 'for every day & gifts',
  subtitle: `Rings & accessories, beauty, perfume, birthday gifts, dolls & more — the same soft, trendy vibe you love on ${brand.instagramHandle}. Visit a store or order via WhatsApp.`,
}

/** Horizontal showreel products (brand videos) */
export const showreel = [
  {
    src: '/videos/rings.mp4',
    name: 'Stack rings',
    tag: 'Jewelry',
    price: 'From Rs. 199',
  },
  {
    src: '/videos/gold.mp4',
    name: 'Gold-tone glow',
    tag: 'Accessories',
    price: 'From Rs. 450',
  },
  {
    src: '/videos/silver.mp4',
    name: 'Sparkle edit',
    tag: 'Gifts & more',
    price: 'From Rs. 350',
  },
]

/**
 * Sample bestsellers across categories — replace with real SKUs/photos.
 */
export const bestsellers = [
  {
    name: 'Stack ring set',
    meta: 'Jewelry',
    price: 'From Rs. 199',
    image: '/images/product-rings.jpg',
  },
  {
    name: 'Rose statement ring',
    meta: 'Jewelry',
    price: 'From Rs. 350',
    image: '/images/product-sparkle.jpg',
  },
  {
    name: 'Everyday gold bracelet',
    meta: 'Accessories',
    price: 'From Rs. 450',
    image: '/images/product-gold.jpg',
  },
  {
    name: 'Soft glow beauty kit',
    meta: 'Beauty',
    price: 'From Rs. 499',
    image: '/images/product-sparkle-2.jpg',
  },
  {
    name: 'Signature perfume mist',
    meta: 'Perfume',
    price: 'From Rs. 799',
    image: '/images/product-gold-2.jpg',
  },
  {
    name: 'Birthday gift doll set',
    meta: 'Gifts & dolls',
    price: 'From Rs. 650',
    image: '/images/product-rings-2.jpg',
  },
]

export const categories = [
  {
    name: 'Jewelry',
    blurb: 'Rings · earrings · stacks',
    image: '/images/product-rings.jpg',
  },
  {
    name: 'Accessories',
    blurb: 'Bracelets · chains · cute finds',
    image: '/images/product-gold.jpg',
  },
  {
    name: 'Beauty',
    blurb: 'Skincare · makeup · glow',
    image: '/images/product-sparkle.jpg',
  },
  {
    name: 'Perfume',
    blurb: 'Mists · body scent',
    image: '/images/product-sparkle-2.jpg',
  },
  {
    name: 'Gifts & dolls',
    blurb: 'Birthday · cute gifts',
    image: '/images/product-rings-2.jpg',
  },
  {
    name: 'More in store',
    blurb: 'Ask on WhatsApp · visit us',
    image: '/images/product-gold-2.jpg',
  },
]

/** From Instagram bio @rings.nepal — fill missing phones when owner confirms */
export const stores = [
  { name: 'New Baneshwor', phone: '9823770857', note: 'Opposite Sansad Bhawan' },
  { name: 'Kalanki', phone: '9818570850', note: 'Real Trade Centre' },
  { name: 'Putalisadak', phone: '9703954170', note: 'Laxmi Plaza' },
  { name: 'Patan, Lalitpur', phone: '9823770857', note: 'Na-Tole area' },
  { name: 'Chabahil Stupa', phone: '', note: 'Near stupa · DM for details' },
  { name: 'Maitidevi', phone: '', note: 'Kathmandu · DM for details' },
  { name: 'Gongabu', phone: '', note: 'Kathmandu · DM for details' },
  { name: 'Sankhamul', phone: '', note: 'Kathmandu · DM for details' },
]

export const orderSteps = [
  {
    step: '01',
    title: 'Pick what you need',
    text: 'Jewelry, beauty, perfume, gifts & more — filter by category or open Just arrived.',
  },
  {
    step: '02',
    title: 'WhatsApp us',
    text: 'Tap Order — we reply with stock, options, and total price.',
  },
  {
    step: '03',
    title: 'Pay & receive',
    text: 'Pay as agreed (eSewa / Khalti / COD where available). Valley delivery in 2–3 days, or visit a store.',
  },
]
