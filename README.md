# Ring Nepal — Website

Premium jewelry marketing site for **Ring Nepal** (`@rings.nepal`).  
Phase 1: hero video, product showreel, bestsellers → **WhatsApp orders**, store list.

## Quick start

```bash
cd web
npm install
npm run dev
```

Open http://127.0.0.1:5173/

## Admin panel (add products without code)

1. Run the site: `npm run dev`
2. Open **http://127.0.0.1:5173/admin**
3. Login password: **`ringnepal2024`** (change after login)
4. **Products** → Add product, set name/price, upload photo, Save
5. Shop homepage updates after Save
6. **Export JSON** and replace `public/data/catalog.json` before production deploy

## Edit content (developers)

```
src/data/defaultCatalog.ts   # code defaults
public/data/catalog.json     # file loaded for all users (until local admin save)
```

## Scripts

| Command | What it does |
|---------|----------------|
| `npm run dev` | Local development |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |

## Go live

See **[GO-LIVE.md](./GO-LIVE.md)** for the full checklist and deploy steps.

## Stack

- React + TypeScript + Vite  
- Tailwind CSS v4  
- Lucide icons  
- Local videos in `public/videos/`  

## Project layout

```
web/
  public/
    brand/          logo
    images/         product stills
    videos/         hero + showreel clips
  src/
    data/site.ts    ← edit business data here
    components/     UI
```
