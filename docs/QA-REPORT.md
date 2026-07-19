# Ring Nepal — Full QA Report

**Date:** 2026-07-16  
**Role:** QA (build · static · assets · logic · E2E shop + admin)  
**Environment:** Linux · Node 20.18 · Vite preview `http://127.0.0.1:4173`  
**Suite:** `node scripts/qa-e2e.mjs` · artifacts in `qa-artifacts/`

---

## Verdict

### **PASS — ready for client demo (Phase 1)**

| Gate | Result |
|------|--------|
| TypeScript + production build | **PASS** |
| Catalog assets (images/videos) | **PASS** (0 missing, HTTP 200) |
| Pure logic (order message, WA, tel) | **PASS** |
| E2E Playwright (39 checks) | **PASS 39 / 39** |
| Critical console errors | **None** |
| oxlint | **BLOCKED** (tooling env: missing `@oxlint/binding-linux-x64-gnu`) |

---

## What was tested

### A. Build & tooling
- `npm run build` (`tsc -b && vite build`) — success  
- `npm run lint` — fails due to **oxlint native binding** not installed in this environment (not an app code defect)

### B. Catalog & assets
- 6 products, all `active`, 4 marked `isNew`
- Required product fields present (`id`, `name`, `meta`, `price`, `image`, `stock`, `isNew`, …)
- WhatsApp: `9779823770857` (digits only, length 13)
- All product + category images under `public/images/cat-*.jpg` resolve
- Hero video + poster resolve

### C. Customer shop (E2E)
| Check | Status |
|-------|--------|
| Home HTTP 200 | PASS |
| Title / SEO multi-category | PASS |
| Sections: showreel, new, featured, how, collections, stores | PASS |
| Copy: Jewelry, Beauty, Perfume, Gifts, Just arrived, WhatsApp | PASS |
| Product images present + decode after scroll | PASS |
| 28× `wa.me` links, correct number | PASS |
| Category filter (Beauty) | PASS |
| Quick view open / WA product message / close | PASS |
| Floating WhatsApp FAB | PASS |
| Mobile menu | PASS |
| Unknown route → home | PASS |

### D. Admin (E2E)
| Check | Status |
|-------|--------|
| Login page | PASS |
| Wrong password rejected | PASS |
| Password `###321ring` → dashboard | PASS |
| Tabs: Products, Inventory, Videos, Stores, Settings | PASS |
| Just arrived control | PASS |
| Add product | PASS |
| Unsaved indicator | PASS |
| Save toast | PASS |
| Inventory table | PASS |

### E. Bugs found & fixed during QA
| Issue | Severity | Fix |
|-------|----------|-----|
| **Export JSON ignored unsaved draft** — owner could export stale catalog | Medium | `exportJson(working)` exports draft; toast warns if still unsaved |
| E2E false fail: lazy images “broken” before scroll | Test only | Scroll + wait in suite |
| E2E crash: duplicate “Products” buttons | Test only | Scope clicks to `header` |

---

## Known limitations (not demo blockers)

These are **by design** for Phase 1 or environment — document for client honesty:

1. **Admin password is client-side** (in catalog JSON / localStorage). Fine for demo; not bank-grade security. Change password before go-live.
2. **Saves are browser-local** until Export → deploy `catalog.json`. Other devices won’t see edits automatically.
3. **Admin-uploaded photos** (`idb:`) are only on that browser; WhatsApp order text falls back to “check website.”
4. **4 store phones empty** (Chabahil, Maitidevi, Gongabu, Sankhamul) → Instagram DM fallback.
5. **Demo product photos** are generated placeholders (not real Ring Nepal stock). Replace with real photos for production.
6. **oxlint** may need `npm i` repair on this machine for lint CI.
7. `npm audit` reported vulnerabilities in dev deps after Playwright install — review before production CI if locking Playwright.

---

## Screenshots

Saved under `qa-artifacts/`:
- `01-home.png` — full homepage  
- `02-quickview.png` — product quick view  
- `03-mobile-home.png` — mobile  
- `04-mobile-menu.png` — mobile nav  
- `05-admin-dashboard.png`  
- `06-admin-products.png`  
- `qa-report.json` — machine-readable results  

---

## How to re-run QA

```bash
cd web
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
# other terminal:
node scripts/qa-e2e.mjs
```

---

## Go-live QA checklist (manual, owner)

- [ ] Change admin password  
- [ ] Replace demo images with real product photos  
- [ ] Confirm all store phones  
- [ ] Tap every WhatsApp Order on a real phone (iOS + Android)  
- [ ] Hero video muted autoplay on iPhone Safari  
- [ ] Export JSON + deploy so all visitors share one catalog  
- [ ] Optional: Meta Pixel / Analytics  

---

## Summary for client

> Shop and admin **pass full automated QA** for Phase 1 demo: multi-category catalog, new arrivals, quick view + WhatsApp orders, filters, mobile nav, admin login/stock/products/save.  
> One medium bug (export without save) was **fixed during QA**.  
> Remaining items are **content** (real photos, phones) and **ops** (deploy export), not software blockers.

**QA sign-off: PASS for client demo.**
