# Ring Nepal — Go-live checklist

Use this before showing the site to the business or putting it on a real domain.

## Admin panel (easiest for the shop owner)

1. Open **`/admin`** (e.g. `http://127.0.0.1:5173/admin`)
2. Password default: **`###321ring`** (change under Brand & login)
3. Add / edit products, upload photos, set prices, stores, WhatsApp
4. Click **Save changes** → shop updates immediately in that browser
5. Click **Export JSON** → save as `public/data/catalog.json` and redeploy so all visitors see the same data

## 1. Edit business data (optional, without admin)

Open **`src/data/defaultCatalog.ts`** or **`public/data/catalog.json`** and update:

- [ ] `brand.whatsapp` — main order number (digits only, with country code, e.g. `97798XXXXXXXX`)
- [ ] Store phones that still say “DM for details”
- [ ] Product **names** and **prices** in `bestsellers` and `showreel` (real SKUs)
- [ ] Swap product images under `public/images/` with real product photos when ready
- [ ] Confirm Instagram + Daraz links

## 2. What the owner must send you

| Item | Why |
|------|-----|
| 8–20 product photos (square or 4:5) | Replace stills / Unsplash feel |
| Exact prices in NPR | Trust |
| All branch WhatsApp / landline numbers | Stores section |
| Store hours (optional) | Trust |
| Preferred domain (e.g. ringnepal.com) | Hosting |
| Logo PNG (if higher quality than IG crop) | Sharper nav |

## 3. Deploy (pick one)

### Vercel (recommended)

```bash
cd web
npm run build
npx vercel --prod
```

Or connect the GitHub repo in [vercel.com](https://vercel.com) → Framework: Vite → Root: `web`.

### Netlify

```bash
cd web
npm run build
# drag & drop the `dist` folder at app.netlify.com/drop
# or: netlify deploy --prod --dir=dist
```

Build command: `npm run build`  
Publish directory: `dist`

### Preview locally

```bash
cd web
npm run build
npm run preview
```

## 4. After deploy

- [ ] Open site on a phone (4G)
- [ ] Tap every WhatsApp **Order** button — message opens correctly
- [ ] Hero video plays muted on iPhone Safari
- [ ] Horizontal showreel swipes smoothly
- [ ] Add custom domain + HTTPS (automatic on Vercel/Netlify)
- [ ] Optional: Google Analytics or Meta Pixel

## 5. Honest sales pitch to the business

**This delivery = Phase 1**

- Premium homepage + video
- WhatsApp order funnel
- Stores + how-to-buy + basic privacy/order notes

**Not included yet (Phase 2 quote separately)**

- Full cart + eSewa / Khalti online checkout
- Admin panel / inventory
- Customer accounts

## 6. Suggested Phase 2 (later)

1. Real catalog CMS or Shopify/WooCommerce  
2. eSewa + Khalti + COD  
3. SMS order updates  
4. Festival campaign landing blocks  

---

When all checkboxes in §1–4 are done, the site is ready to **run WhatsApp-driven sales** for the business.
