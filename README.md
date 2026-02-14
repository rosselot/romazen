# Romazen Website

Marketing website for Romazen, built with React, Vite, and React Router.

## Stack

- React 19
- Vite 7
- React Router 7
- Framer Motion
- CSS Modules
- ESLint 9 (flat config)
- Vitest + Testing Library + Node test runner

## Requirements

- Node.js 20+
- npm 10+

## Local Development

```bash
npm install
npm run dev
```

Dev server default: `http://localhost:5173`

## Scripts

- `npm run dev`: start local dev server
- `npm start`: start local dev server
- `npm run build`: production build into `dist/`
- `npm run preview`: preview production build
- `npm run lint`: run ESLint
- `npm run test`: run UI tests + Node regression checks
- `npm run test:ui`: run Vitest/RTL tests only
- `npm run test:checks`: run Node regression checks only
- `npm run test:watch`: run Vitest in watch mode
- `npm run test:coverage`: run Vitest with coverage
- `npm run images:audit`: report image payload and oversized files
- `npm run images:optimize`: generate WebP variants to `public/assets/images/optimized` (requires optional `sharp`)

## Routes

Defined in `src/App.jsx`:

- `/` -> Home page
- `/prices` -> In-store candle pricing page
- `/scan` -> In-store candle pricing page
- `/shop` -> All products collection page
- `/candles` -> Candle collection page
- `/soaps` -> Soap collection page
- `/fragrances` -> Home fragrance collection page
- `/cleaning` -> Eco cleaning collection page
- `/about` -> Brand story page
- `/sustainability` -> Sustainability page
- `/contact` -> Contact page
- `/privacy` -> Privacy policy page
- `/terms` -> Terms of service page
- `*` -> Custom 404 page

## Deployment

- `vercel.json` rewrites all routes to `index.html` for SPA routing.
- Security headers are set in `vercel.json` (CSP, frame, referrer, permissions, MIME sniffing).
- Build output: `dist/`
- Crawl assets: `public/robots.txt`, `public/sitemap.xml`

## Quality Automation

- CI workflow in `.github/workflows/ci.yml` runs lint, tests, build, and image audit on push/PR.

## Code Review (2026-02-14)

### Executed checks

- `npm run lint` ✅
- `npm run test` ✅
- `npm run build` ✅

### Findings

1. Resolved (was High): CSP blocked inline JSON-LD structured data
   - `index.html` uses inline schema markup in `<script type="application/ld+json">`.
   - `vercel.json` now includes the exact `sha256` hash for this inline JSON-LD script in `script-src`.
   - Result: structured data remains allowed without enabling broad inline scripts.
   - References: `index.html:22`, `vercel.json:24`

2. Resolved (was Medium): Mobile nav remained open after some route changes
   - `Navbar` now closes menu state on `location.pathname` changes.
   - A regression UI test verifies open menu -> route change -> menu closes.
   - References: `src/components/Layout/Navbar.jsx`, `src/App.test.jsx`

### Test coverage gaps

- No test validates CSP compatibility for inline JSON-LD behavior.
- No dedicated test for browser history back/forward behavior with menu state.
- Resolved: `usePageMeta` now has tests covering `canonical`, `robots`, and Open Graph/Twitter tags.

## Current Limitations

- Newsletter form UI exists, but no submission backend is wired.
