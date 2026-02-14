# Romazen Website

Marketing website for Romazen, built with React, Vite, and React Router.

## Tech Stack

- React 19
- Vite 7
- React Router 7
- Framer Motion
- CSS Modules
- ESLint 9 (flat config)

## Local Development

### Requirements

- Node.js 20+
- npm 10+

### Setup

```bash
npm install
```

### Run

```bash
npm run dev
```

The app runs on Vite's local dev server (default: `http://localhost:5173`).

## Available Scripts

- `npm run dev`: start local dev server
- `npm start`: start local dev server
- `npm run build`: production build into `dist/`
- `npm run preview`: preview the production build locally
- `npm run lint`: run ESLint
- `npm run test`: run Vitest UI tests plus Node-based regression checks
- `npm run test:ui`: run Vitest/RTL tests
- `npm run test:checks`: run Node-based regression checks
- `npm run test:watch`: run Vitest in watch mode
- `npm run test:coverage`: run Vitest with coverage
- `npm run images:audit`: report image payload and oversized files
- `npm run images:optimize`: generate responsive WebP variants into `public/assets/images/optimized` (requires optional `sharp` dependency)

## Routes

Defined in `/src/App.jsx`:

- `/` -> QR-first candle pricing page
- `/` -> Home page
- `/prices` -> QR-first candle pricing page
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
- `/scan` -> QR-first candle pricing page
- `*` -> custom 404 page

## Deployment

- Vercel config in `/vercel.json` rewrites all paths to `index.html` for SPA routing.
- Vercel config applies basic security headers (CSP, frame, referrer, permissions, MIME sniffing).
- Build output directory: `dist/`
- Static crawl assets are provided at `/robots.txt` and `/sitemap.xml`.

## Quality Automation

- GitHub Actions workflow in `/.github/workflows/ci.yml` runs lint, test, build, and image audit on push/PR.

## Project Structure

```text
src/
  components/
    Layout/
    Sections/
    UI/
  data/
  pages/
public/
```

## Current Limitations

- Newsletter form UI is present, but no submission backend is wired.
