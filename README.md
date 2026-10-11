# Nokware Farms

Customer storefront for Nokware Farms — live livestock, poultry, snails, and fresh meat, ordered online for delivery or farm pickup in Ghana.

**Frontend only.** There is no backend: every service in `src/services/` resolves mock data from `src/data/mock/` with simulated latency (`src/services/_client.ts`), and state persists to `localStorage` via Zustand. No real payments, OTPs, or orders are processed.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Radix UI primitives · Zustand · React Router 7 · lucide icons.
Fonts are self-hosted via Fontsource: **Source Serif 4** (headings) and **Plus Jakarta Sans** (UI/body).

## Run

```bash
npm ci
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
npm run lint     # oxlint
```

Demo login: any valid Ghana mobile number, OTP `123456` (see `src/config/app.config.ts`).

## Where things live

| Path | What |
| --- | --- |
| `src/features/` | Route-level pages (home, shop, product, cart, checkout, orders, account, onboarding) |
| `src/components/ui/` | Design-system primitives |
| `src/components/domain/` | Product, cart, checkout, order components |
| `src/config/` | Brand, categories, copy, feature flags |
| `src/data/mock/` | Catalogue, orders, delivery zones, images |
| `src/index.css` | Design tokens (colors, type scale, radii, shadows) |

## Imagery

Product images are branded placeholders (`src/data/mock/images.ts`). Set `url` on any `ProductImage` to a real photo and `ProductMedia` renders it with no component changes. Real farm photography is the single biggest remaining upgrade.

## Deploy

Static build on Vercel; `vercel.json` rewrites all paths to `index.html` for client-side routing.
