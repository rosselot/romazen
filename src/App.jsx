import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import CollectionPage from './pages/CollectionPage';
import BasicPage from './pages/BasicPage';
import CandlePricingPage from './pages/CandlePricingPage';
import { useValentineMode } from './hooks/useValentineMode';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
};

function App() {
  const hasCategory = (keyword) => (product) => product.category.toLowerCase().includes(keyword);
  const isValentineMode = useValentineMode();

  React.useEffect(() => {
    document.body.classList.toggle('theme-valentine', isValentineMode);

    return () => {
      document.body.classList.remove('theme-valentine');
    };
  }, [isValentineMode]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/prices" element={<CandlePricingPage />} />
        <Route path="/scan" element={<CandlePricingPage />} />
        <Route
          path="/shop"
          element={
            <CollectionPage
              metaTitle="Shop All Products | Romazen"
              metaDescription="Browse the full Romazen collection of premium candles, soaps, fragrances, and home care."
              eyebrow="Romazen Shop"
              heading="Shop All Products"
              subheading="The full Romazen collection, curated for elevated everyday rituals."
            />
          }
        />
        <Route
          path="/candles"
          element={
            <CollectionPage
              metaTitle="Luxury Soy Candles | Romazen"
              metaDescription="Explore Romazen luxury soy candles crafted to bring a warm, sophisticated atmosphere to your home."
              eyebrow="Category"
              heading="Luxury Soy Candles"
              subheading="Warmth, elegance, and scent profiles inspired by NYC evenings."
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
              description="Learn the story behind Romazen, a boutique wellness house inspired by the rhythm and elegance of New York."
              eyebrow="Our Story"
              body="Romazen was created to bring moments of stillness into fast city living. We handcraft premium home rituals rooted in design, calm, and everyday elegance."
              ctaLabel="Shop Collection"
              ctaTo="/shop"
            >
              <p>Each product is developed in small batches with a focus on ingredient quality, scent architecture, and visual refinement.</p>
              <p>Our goal is simple: make your space feel intentional, welcoming, and deeply personal.</p>
            </BasicPage>
          }
        />
        <Route
          path="/sustainability"
          element={
            <BasicPage
              title="Sustainability | Romazen"
              description="Read how Romazen prioritizes responsible sourcing, recyclable packaging, and conscious small-batch production."
              eyebrow="Responsibility"
              body="Our sustainability approach combines responsible materials, reduced-waste packaging, and long-term quality over short-term volume."
              ctaLabel="Explore Products"
              ctaTo="/shop"
            >
              <p>We prioritize recyclable packaging, thoughtful supplier selection, and durable product design.</p>
              <p>As the brand grows, we continuously evaluate how to reduce footprint without compromising craftsmanship.</p>
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
    </>
  );
}

export default App;
