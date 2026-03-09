# Romazen Codebase Analysis Report

This document serves as a comprehensive technical analysis of the Romazen marketing & ecommerce SPA, compiled after a thorough review of the repository.

---

## 1. Project Overview & Tech Stack

**Romazen** is a modern frontend-heavy Single Page Application (SPA) designed as a boutique e-commerce frontend.

**Core Stack:**
- **Framework:** React 19
- **Build Tool:** Vite 7
- **Routing:** React Router 7 (`react-router-dom`)
- **Animation:** Framer Motion
- **Styling:** Vanilla CSS + CSS Modules
- **Quality/Testing:** ESLint 9 (flat config), Vitest, React Testing Library
- **Payments:** Stripe (`@stripe/stripe-js` & Node backend sdk)
- **Deployment & Hosting:** Vercel (configured via `vercel.json`)

**Overall Assessment:** The stack is highly modern and minimal. The use of Vite and React 19 indicates a forward-looking architecture. Avoiding a heavy UI framework in favor of CSS Modules + Framer Motion points to a strong emphasis on bespoke design, bespoke animations, and performance.

---

## 2. Directory Structure & Architecture

The project follows a standard scalable React SPA layout:

```text
websiteAG/
├── api/                   # Vercel Serverless Functions (Node.js)
├── public/                # Static assets (robots.txt, sitemap.xml)
├── scripts/               # Node scripts for build/maintenance (image optimization)
├── src/                   # Main frontend source code
│   ├── assets/            # Fonts, static images
│   ├── components/        # React Components
│   │   ├── Cart/          # Shopping cart UI components
│   │   ├── Layout/        # Shared layout wrappers (Navbar, Footer)
│   │   ├── Sections/      # Page-level compositional sections (Hero, About, Newsletter)
│   │   └── UI/            # Reusable primitive UI elements (Button)
│   ├── context/           # React Context providers (CartContext)
│   ├── data/              # Static Mock Data / Product Catalogs
│   ├── hooks/             # Custom React hooks (usePageMeta)
│   ├── pages/             # Route-level Page components
│   └── test/              # Test utilities or global test setups
├── tests/                 # Unit and regression test files (Vitest/Node)
├── package.json           # Dependencies and custom NPM scripts
├── vercel.json            # Vercel hosting rules and security headers
└── vite.config.js         # Vite bundler configuration
```

### Component Architecture
The application favors a clean separation of concerns:
1. **Pages (`src/pages/`)**: Act as orchestrators. They define page metadata (`usePageMeta`), fetch or pass down data, and compose `Sections`. `App.jsx` handles declarative routing to these pages.
2. **Sections (`src/components/Sections/`)**: Cohesive blocks of a page (e.g., `SignatureCollection`, `Hero`).
3. **UI Primitives (`src/components/UI/`)**: Reusable atomic components (e.g., `Button`).

---

## 3. Routing & Navigation

**React Router 7** manages client-side navigation inside `src/App.jsx`. 
- **Routes Defined**: `/`, `/prices`, `/scan`, `/shop`, `/candles`, `/soaps`, `/fragrances`, `/cleaning`, `/about`, `/sustainability`, `/contact`, `/privacy`, `/terms`, and a `404` fallback.
- **Scroll Management**: A custom `<ScrollToTop />` component listens to `pathname` changes and resets the window scroll position, a critical detail for SPA UX.
- **Dynamic Content via Props**: Instead of creating distinct hardcoded components for every category, `/candles`, `/soaps`, etc. reuse the `<CollectionPage />` component and pass different `filterFn` props to filter the global product catalog.

**Server Behavior (`vercel.json`)**: 
All requests are rewritten to `/index.html` to allow React Router to handle the URL on the client, standard practice for client-side SPAs.

---

## 4. State Management & Data Flow

**Global State:**
State management is kept simple and native using React Context. 
- **Cart State**: Managed by `CartContext.jsx`. It holds the `items` array and the `isDrawerOpen` toggle. 
- **Persistence**: `CartContext` utilizes `localStorage` to persist the cart across sessions (`romazen_cart`). 
- **Operations**: Includes helper functions attached to the context (`addItem`, `removeItem`, `updateQuantity`, `clearCart`) and derived data (`cartTotal`, `cartCount`).

**Data Sourcing:**
Currently, product data is hardcoded in the repository rather than fetched from a remote CMS:
- `src/data/products.js`
- `src/data/candlePrices.js`

This is highly performant but requires a code deployment to update product inventory or prices.

---

## 5. API & Checkout Integration

The project integrates with Stripe for a serverless checkout flow.
- **Frontend**: The cart accumulates items and quantities.
- **Backend**: A Vercel Serverless Function at `api/create-checkout-session.js`.

**Security & Implementation Pattern:**
- The frontend sends a `POST` request to `api/create-checkout-session.js` containing only the `items` (IDs and Quantities).
- **CRITICAL Pattern:** The backend *does not* trust the price sent from the client. It combines `PRODUCTS` and `STORE_CANDLE_PRICES` from the server's local data files to look up the authoritative price and product details.
- It calculates the total in cents and creates a Stripe Checkout Session with predefined shipping options (e.g. $5.00 Standard Shipping for US/CA).
- Upon success, Stripe redirects the user back to the frontend with `?checkout=success`.

---

## 6. Styling & Design System

The app utilizes a vanilla CSS approach augmented with **CSS Modules**.

**Global Tokens (`index.css`):**
- **Colors**: Defined as CSS variables root tokens (e.g., `--onyx-black: #121212`, `--champagne-gold: #D4AF37`, `--soft-ivory: #F9F9F7`). 
- **Typography**: Imports and applies `Playfair Display` for serif headers and `Inter` for sans-serif body text.
- **Spacing/Transitions**: Global variables for container widths (`--container-max-width`) and standardized transitions (`--transition-smooth`).

**Component Scoping:**
Every component has an associated `.module.css` file (e.g., `Navbar.module.css`, `Hero.module.css`). This prevents CSS class name collisions globally while still giving the developer the full power of native CSS, an excellent choice for a bespoke, animation-heavy marketing site.

---

## 7. Build, Quality, & DevOps

- **Testing**: Excellent testing setup utilizing Vitest alongside React Testing Library (`@testing-library/react`) for UI components, and the native Node test runner for certain backend/script checks.
- **CI/CD**: Configured via GitHub Actions (`.github/workflows/ci.yml`), which enforces linting, tests, builds, and custom image audits on PRs.
- **Custom Scripts**: Includes `scripts/image-audit.mjs` and `scripts/optimize-images.mjs`. This suggests a strong focus on Core Web Vitals and frontend performance (critical for e-commerce).
- **SEO & Meta**: A custom hook `usePageMeta.js` dynamically updates the `<title>` and `<meta>` tags as the user navigates the SPA. `vercel.json` manages strict Security Headers.

---

## 8. Limitations & Future Recommendations

1. **Hardcoded Catalog**: Relying on `products.js` means non-technical users cannot update inventory. *Recommendation:* Migrate to a Headless CMS (Sanity, Contentful) or Shopify Storefront API if inventory changes frequently.
2. **Missing Backend Features**: The `README.md` explicitly notes that the Newsletter form UI exists but has no backend wiring. *Recommendation:* Connect this to an API route integrating with Mailchimp/Klaviyo.
3. **Cart Sync**: `localStorage` is great for anonymous users, but if user accounts are ever introduced, the cart will need to be synced with a database.
4. **Static Image Optimization**: Running local Node scripts for image optimization is good, but utilizing Vercel's built-in Image Optimization or an external CDN (Cloudinary) could simplify the build pipeline further.
