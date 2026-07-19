import type { Catalog } from './types'

/** Built-in defaults — also mirrored to public/data/catalog.json */
export const defaultCatalog: Catalog = {
  version: 1,
  updatedAt: new Date().toISOString(),
  brand: {
    name: 'Ring Nepal',
    nameNp: 'Ring नेपाल',
    tagline: "Rings, necklaces, earrings & cute accessories",
    estd: '2024',
    city: 'Kathmandu',
    storeCount: 8,
    instagram: 'https://www.instagram.com/rings.nepal/',
    instagramHandle: '@rings.nepal',
    daraz: 'https://s.daraz.com.np/s.ZV5Vm',
    whatsapp: '9779823770857',
    deliveryNote:
      'Kathmandu Valley 2–3 days · COD available · All-Nepal delivery on request',
    adminPassword: '###321ring',
    showStockOnSite: true,
    defaultLowStockAt: 5,
  },
  hero: {
    video: '/videos/hero.mp4?v=silver',
    poster: '/videos/hero-poster.jpg?v=silver',
    eyebrow: '8 stores · Kathmandu & Lalitpur',
    line1: 'Pretty little things',
    line2: 'for every day & gifts',
    subtitle: "Rings, necklaces, earrings, bracelets, scarves & sunglasses — same cute vibe as @rings.nepal. Browse online, order on WhatsApp, or visit a store.",
  },
  showreel: [
    {
      id: 'sr1',
      src: '/videos/rings.mp4',
      name: 'Stack rings',
      tag: 'Rings',
      price: 'From Rs. 199'
    },
    {
      id: 'sr2',
      src: '/videos/gold.mp4',
      name: 'Gold-tone glow',
      tag: 'Jewelry',
      price: 'From Rs. 450'
    },
    {
      id: 'sr3',
      src: '/videos/silver.mp4',
      name: 'Sparkle edit',
      tag: 'Necklaces',
      price: 'From Rs. 350'
    },
    {
      id: 'sr4',
      src: '/videos/lookbook.mp4',
      name: 'Lookbook edit',
      tag: 'New',
      price: 'Shop the look'
    },
    {
      id: 'sr5',
      src: '/videos/sparkle.mp4',
      name: 'Everyday shine',
      tag: 'Earrings',
      price: 'From Rs. 199'
    }
  ],
  bestsellers: [
    {
      id: 'p-ring4',
      name: 'Floral gold ring',
      meta: 'Rings',
      price: 'From Rs. 199',
      image: '/images/ring4.jpg',
      active: true,
      sku: 'RN-RING-004',
      stock: 15,
      lowStockAt: 5,
      trackStock: true,
      isNew: true
    },
    {
      id: 'p-ring6',
      name: 'Daisy vine gold ring',
      meta: 'Rings',
      price: 'From Rs. 249',
      image: '/images/ring6.jpg',
      active: true,
      sku: 'RN-RING-006',
      stock: 12,
      lowStockAt: 5,
      trackStock: true,
      isNew: true
    },
    {
      id: 'p-ring9',
      name: 'Leaf branch gold ring',
      meta: 'Rings',
      price: 'From Rs. 229',
      image: '/images/ring9.jpg',
      active: true,
      sku: 'RN-RING-009',
      stock: 10,
      lowStockAt: 5,
      trackStock: true,
      isNew: false
    },
    {
      id: 'p-ring10',
      name: 'Two-tone cross ring',
      meta: 'Rings',
      price: 'From Rs. 299',
      image: '/images/ring10.jpg',
      active: true,
      sku: 'RN-RING-010',
      stock: 8,
      lowStockAt: 3,
      trackStock: true,
      isNew: true
    },
    {
      id: 'p-ring13',
      name: 'Silver swirl CZ ring',
      meta: 'Rings',
      price: 'From Rs. 279',
      image: '/images/ring13.jpg',
      active: true,
      sku: 'RN-RING-013',
      stock: 14,
      lowStockAt: 5,
      trackStock: true,
      isNew: false
    },
    {
      id: 'p-earing1',
      name: 'Bow pearl drop earrings',
      meta: 'Earrings',
      price: 'From Rs. 199',
      image: '/images/earing1.jpg',
      active: true,
      sku: 'RN-EAR-001',
      stock: 20,
      lowStockAt: 5,
      trackStock: true,
      isNew: true
    },
    {
      id: 'p-earing3',
      name: 'White bow stud earrings',
      meta: 'Earrings',
      price: 'From Rs. 179',
      image: '/images/earing3.jpg',
      active: true,
      sku: 'RN-EAR-003',
      stock: 18,
      lowStockAt: 5,
      trackStock: true,
      isNew: true
    },
    {
      id: 'p-necles',
      name: 'Gold bow necklace',
      meta: 'Necklaces',
      price: 'From Rs. 299',
      image: '/images/necles.jpg',
      active: true,
      sku: 'RN-NCK-001',
      stock: 16,
      lowStockAt: 5,
      trackStock: true,
      isNew: false
    },
    {
      id: 'p-necles1',
      name: 'Seashell pearl necklace set',
      meta: 'Necklaces',
      price: 'From Rs. 399',
      image: '/images/necles1.jpg',
      active: true,
      sku: 'RN-NCK-002',
      stock: 11,
      lowStockAt: 4,
      trackStock: true,
      isNew: true
    },
    {
      id: 'p-necles4',
      name: 'Daisy pearl necklace set',
      meta: 'Necklaces',
      price: 'From Rs. 449',
      image: '/images/necles4.jpg',
      active: true,
      sku: 'RN-NCK-004',
      stock: 9,
      lowStockAt: 3,
      trackStock: true,
      isNew: true
    },
    {
      id: 'p-necles5',
      name: 'Heart & pearl necklace set',
      meta: 'Necklaces',
      price: 'From Rs. 429',
      image: '/images/necles5.jpg',
      active: true,
      sku: 'RN-NCK-005',
      stock: 10,
      lowStockAt: 3,
      trackStock: true,
      isNew: false
    },
    {
      id: 'p-necls6',
      name: 'Chevron pearl jewelry set',
      meta: 'Necklaces',
      price: 'From Rs. 599',
      image: '/images/necls6.jpg',
      active: true,
      sku: 'RN-NCK-006',
      stock: 7,
      lowStockAt: 3,
      trackStock: true,
      isNew: true
    },
    {
      id: 'p-necles8',
      name: 'Layered bar necklace set',
      meta: 'Necklaces',
      price: 'From Rs. 499',
      image: '/images/necles8.jpg',
      active: true,
      sku: 'RN-NCK-008',
      stock: 12,
      lowStockAt: 4,
      trackStock: true,
      isNew: true
    },
    {
      id: 'p-necles9',
      name: 'V-bar lariat necklace',
      meta: 'Necklaces',
      price: 'From Rs. 349',
      image: '/images/necles9.jpg',
      active: true,
      sku: 'RN-NCK-009',
      stock: 13,
      lowStockAt: 4,
      trackStock: true,
      isNew: false
    },
    {
      id: 'p-racelet',
      name: 'Beach shell bracelet stack',
      meta: 'Bracelets',
      price: 'From Rs. 349',
      image: '/images/racelet.jpg',
      active: true,
      sku: 'RN-BRC-001',
      stock: 14,
      lowStockAt: 4,
      trackStock: true,
      isNew: true
    },
    {
      id: 'p-scaf',
      name: 'Polka dot silk scarf',
      meta: 'Accessories',
      price: 'From Rs. 399',
      image: '/images/scaf.jpg',
      active: true,
      sku: 'RN-SCF-001',
      stock: 10,
      lowStockAt: 3,
      trackStock: true,
      isNew: true
    },
    {
      id: 'p-glass',
      name: 'Oval gold sunglasses',
      meta: 'Accessories',
      price: 'From Rs. 499',
      image: '/images/glass.jpg',
      active: true,
      sku: 'RN-GLS-001',
      stock: 8,
      lowStockAt: 3,
      trackStock: true,
      isNew: false
    },
    {
      id: 'p-sunglass',
      name: 'Cat-eye cream sunglasses',
      meta: 'Accessories',
      price: 'From Rs. 549',
      image: '/images/sunglass.jpg',
      active: true,
      sku: 'RN-SNG-001',
      stock: 9,
      lowStockAt: 3,
      trackStock: true,
      isNew: true
    },
    {
      id: 'p-ring15',
      name: 'Rose gold knot ring',
      meta: 'Rings',
      price: 'From Rs. 299',
      image: '/images/ring15.jpg',
      active: true,
      sku: 'RN-RING-015',
      stock: 12,
      lowStockAt: 4,
      trackStock: true,
      isNew: true
    },
    {
      id: 'p-ring16',
      name: 'Rose gold twist band',
      meta: 'Rings',
      price: 'From Rs. 279',
      image: '/images/ring16.jpg',
      active: true,
      sku: 'RN-RING-016',
      stock: 11,
      lowStockAt: 4,
      trackStock: true,
      isNew: true
    },
    {
      id: 'p-ring18',
      name: 'Gold twist open ring',
      meta: 'Rings',
      price: 'From Rs. 259',
      image: '/images/ring18.jpg',
      active: true,
      sku: 'RN-RING-018',
      stock: 14,
      lowStockAt: 4,
      trackStock: true,
      isNew: true
    },
    {
      id: 'p-ring20',
      name: 'Gold braided band ring',
      meta: 'Rings',
      price: 'From Rs. 249',
      image: '/images/ring20.jpg',
      active: true,
      sku: 'RN-RING-020',
      stock: 13,
      lowStockAt: 4,
      trackStock: true,
      isNew: true
    },
    {
      id: 'p-earing12',
      name: 'Leaf swirl stud earrings',
      meta: 'Earrings',
      price: 'From Rs. 299',
      image: '/images/earing12.jpg',
      active: true,
      sku: 'RN-EAR-012',
      stock: 15,
      lowStockAt: 4,
      trackStock: true,
      isNew: true
    },
    {
      id: 'p-earing14',
      name: 'Frosted ball drop earrings',
      meta: 'Earrings',
      price: 'From Rs. 229',
      image: '/images/earing14.jpg',
      active: true,
      sku: 'RN-EAR-014',
      stock: 16,
      lowStockAt: 4,
      trackStock: true,
      isNew: true
    },
    {
      id: 'p-earign15',
      name: 'Leaf swirl studs (on ear)',
      meta: 'Earrings',
      price: 'From Rs. 299',
      image: '/images/earign15.jpg',
      active: true,
      sku: 'RN-EAR-015',
      stock: 12,
      lowStockAt: 4,
      trackStock: true,
      isNew: true
    }
  ],
  categories: [
    {
      id: 'c1',
      name: 'Rings',
      blurb: 'Floral · leaf · stack styles',
      image: '/images/ring4.jpg'
    },
    {
      id: 'c2',
      name: 'Earrings',
      blurb: 'Bows · pearls · studs',
      image: '/images/earing1.jpg'
    },
    {
      id: 'c3',
      name: 'Necklaces',
      blurb: 'Chains · sets · charms',
      image: '/images/necles.jpg'
    },
    {
      id: 'c4',
      name: 'Bracelets',
      blurb: 'Stacks · shells · beads',
      image: '/images/racelet.jpg'
    },
    {
      id: 'c5',
      name: 'Accessories',
      blurb: 'Scarves · sunglasses',
      image: '/images/sunglass.jpg'
    },
    {
      id: 'c6',
      name: 'More in store',
      blurb: 'Ask on WhatsApp · visit us',
      image: '/videos/lookbook.mp4'
    }
  ],
  stores: [
    {
      id: 's1',
      name: 'New Baneshwor',
      phone: '9823770857',
      note: 'Opposite Sansad Bhawan'
    },
    {
      id: 's2',
      name: 'Kalanki',
      phone: '9818570850',
      note: 'Real Trade Centre'
    },
    {
      id: 's3',
      name: 'Putalisadak',
      phone: '9703954170',
      note: 'Laxmi Plaza'
    },
    {
      id: 's4',
      name: 'Patan, Lalitpur',
      phone: '9823770857',
      note: 'Na-Tole area'
    },
    {
      id: 's5',
      name: 'Chabahil Stupa',
      phone: '',
      note: 'Near stupa · DM for details'
    },
    {
      id: 's6',
      name: 'Maitidevi',
      phone: '',
      note: 'Kathmandu · DM for details'
    },
    {
      id: 's7',
      name: 'Gongabu',
      phone: '',
      note: 'Kathmandu · DM for details'
    },
    {
      id: 's8',
      name: 'Sankhamul',
      phone: '',
      note: 'Kathmandu · DM for details'
    }
  ],
  orderSteps: [
    {
      step: '01',
      title: 'Pick what you need',
      text: 'Rings, earrings, necklaces, bracelets & accessories — filter by type or open Just arrived for new drops.'
    },
    {
      step: '02',
      title: 'WhatsApp us',
      text: 'Tap Order — choose delivery or store pickup. We confirm stock, size & total.'
    },
    {
      step: '03',
      title: 'Pay & receive',
      text: 'Pay as agreed (eSewa / Khalti / COD). Valley delivery in 2–3 days, or pick up at your preferred store.'
    }
  ],
  activity: [
    {
      id: 'act1',
      at: new Date().toISOString(),
      message: 'Showreel updated with lookbook + sparkle videos',
    },
  ],
}
