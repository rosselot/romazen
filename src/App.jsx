import React, { Suspense, lazy } from 'react';
import { Navigate, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/Cart/CartDrawer';

const CollectionPage = lazy(() => import('./pages/CollectionPage'));
const BasicPage = lazy(() => import('./pages/BasicPage'));
const CandlePricingPage = lazy(() => import('./pages/CandlePricingPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const CheckoutOutcome = lazy(() => import('./pages/CheckoutOutcome'));

const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
};

function App() {
  const hasCategory = (keyword) => (product) => product.category.toLowerCase().includes(keyword);

  return (
    <CartProvider>
      <ScrollToTop />
      <CartDrawer />
      <Suspense fallback={<p className="routeLoading" role="status">Loading page…</p>}>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/prices" element={<CandlePricingPage />} />
        <Route path="/scan" element={<Navigate to="/prices" replace />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/checkout/success" element={<CheckoutOutcome />} />
        <Route path="/checkout/cancelled" element={<CheckoutOutcome cancelled />} />
        <Route
          path="/shop"
          element={
            <CollectionPage
              metaTitle="Shop All Products | Romazen"
              metaDescription="Shop RomaZen sculptural soy candles in two intimate and four architectural forms, featuring Gardenia & Jasmine."
              eyebrow="Romazen Shop"
              heading="Shop All Products"
              subheading="Six sculptural candle forms lead a collection curated for elevated everyday rituals."
            />
          }
        />
        <Route
          path="/candles"
          element={
            <CollectionPage
              metaTitle="Luxury Soy Candles | Romazen"
              metaDescription="Explore RomaZen Gardenia & Jasmine soy candles in six sculptural glass forms."
              eyebrow="Category"
              heading="Luxury Soy Candles"
              subheading="Luminous gardenia and soft jasmine, shaped into intimate and architectural glass forms."
              filterFn={hasCategory('candles')}
            />
          }
        />
        <Route
          path="/soaps"
          element={
            <CollectionPage
              metaTitle="Artisanal Soaps | Romazen"
              metaDescription="Discover Romazen artisanal soaps made in small batches with thoughtful ingredients and refined scent notes."
              eyebrow="Category"
              heading="Artisanal Soaps"
              subheading="Small-batch soap bars designed for daily luxury."
              filterFn={hasCategory('soaps')}
            />
          }
        />
        <Route
          path="/fragrances"
          element={
            <CollectionPage
              metaTitle="Home Fragrances | Romazen"
              metaDescription="Shop Romazen home fragrances to create calm, elevated spaces with premium scent composition."
              eyebrow="Category"
              heading="Home Fragrances"
              subheading="Premium fragrance blends for calm and character."
              filterFn={hasCategory('fragrances')}
            />
          }
        />
        <Route
          path="/cleaning"
          element={
            <CollectionPage
              metaTitle="Eco Cleaning | Romazen"
              metaDescription="Clean with character using Romazen eco cleaning products that pair performance and premium fragrance."
              eyebrow="Category"
              heading="Eco Cleaning"
              subheading="Home care essentials with elevated formulation and scent."
              filterFn={hasCategory('cleaning')}
            />
          }
        />
        <Route
          path="/about"
          element={
            <BasicPage
              title="About Romazen | Romazen"
              description="Meet the Chilean candle maker behind RomaZen and her small-batch candle craft, now hand-poured in New York."
              eyebrow="Our Story"
              body="RomaZen began with a Chilean candle maker bringing her love of elegant candles and carefully balanced aromas to a new home in New York."
              ctaLabel="Shop Collection"
              ctaTo="/shop"
            >
              <p>Each candle is hand-poured in small batches with a focus on scent, finish, and sculptural glass forms.</p>
              <p>Our goal is simple: bring a calm, beautiful ritual into the homes that are helping this new chapter begin.</p>
            </BasicPage>
          }
        />
        <Route
          path="/sustainability"
          element={
            <BasicPage
              title="Small-Batch Craft | Romazen"
              description="Read about RomaZen's small-batch candle-making approach and commitment to publishing only verified material and sourcing details."
              eyebrow="Our Process"
              body="RomaZen is a young, small-batch candle house focused on consistent candles, careful finishing, and clear burn guidance."
              ctaLabel="Explore Products"
              ctaTo="/shop"
            >
              <p>We make in limited quantities so each candle can receive close attention before it leaves our hands.</p>
              <p>As we document suppliers and packaging materials, we will publish specific sourcing details rather than broad claims.</p>
            </BasicPage>
          }
        />
        <Route
          path="/contact"
          element={
            <BasicPage
              title="Contact | Romazen"
              description="Get in touch with Romazen for support, partnerships, and wholesale opportunities."
              eyebrow="Get in Touch"
              body="For product support, wholesale conversations, or collaboration inquiries, contact the Romazen team."
              ctaLabel="Browse Collection"
              ctaTo="/shop"
            >
              <p>Email: hello@romazen.com</p>
              <p>Instagram: @romazencandles</p>
            </BasicPage>
          }
        />
        <Route
          path="/privacy"
          element={
            <BasicPage
              title="Privacy Policy | Romazen"
              description="Read the Romazen privacy policy and how personal information is handled."
              eyebrow="Legal"
              body="Romazen respects your privacy and collects only the information needed to operate our website and customer communication."
            >
              <p>We do not sell personal information. Data is used for site functionality, customer support, and consented marketing communications.</p>
              <p>If you have privacy-related questions, contact hello@romazen.com.</p>
            </BasicPage>
          }
        />
        <Route
          path="/terms"
          element={
            <BasicPage
              title="Terms of Service | Romazen"
              description="Review the Romazen terms of service for use of this website and related services."
              eyebrow="Legal"
              body="By using this site, you agree to standard terms regarding acceptable use, content ownership, and limitation of liability."
            >
              <p>All brand assets and website content remain the intellectual property of Romazen unless otherwise stated.</p>
              <p>Terms may be updated periodically to reflect product and operational changes.</p>
            </BasicPage>
          }
        />
        <Route
          path="*"
          element={
            <BasicPage
              title="Page Not Found | Romazen"
              description="The page you are looking for could not be found."
              eyebrow="404"
              body="The page you requested does not exist or has moved."
              ctaLabel="Back to Home"
              ctaTo="/"
              noIndex
            />
          }
        />
        </Routes>
      </Suspense>
    </CartProvider>
  );
}

export default App;
