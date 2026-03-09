import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Button from '../components/UI/Button';
import { supabase } from '../utils/supabase';
import { INSTAGRAM_URL } from '../data/social';
import { usePageMeta } from '../hooks/usePageMeta';
import { useCart } from '../context/CartContext';
import styles from './CandlePricingPage.module.css';

const CandlePricingPage = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [selectedId, setSelectedId] = useState(null);
  const [candles, setCandles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Fetch candles from Supabase on mount
  useEffect(() => {
    const fetchCandles = async () => {
      // Prevent crash if env variables were not injected by Vite/Vercel
      if (!supabase) {
        console.error('Supabase client not initialized. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
        setErrorMsg('Database configuration missing. Please check Vercel environment variables.');
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching candles:', error);
        setErrorMsg(`Failed to load catalog: ${error.message}`);
      } else {
        setCandles(data || []);
      }
      setIsLoading(false);
    };

    fetchCandles();
  }, []);

  const selectedItem = candles.find((item) => item.id === selectedId) ?? null;

  usePageMeta({
    title: 'In-Store Candle Prices | Romazen',
    description: 'Scan-ready in-store Romazen candle pricing, sizes, and scent notes.',
  });

  if (isLoading) {
    return (
      <Layout>
        <section className={styles.page}>
          <div className="container">
            <div className={styles.header}>
              <h1 className={styles.title}>Loading Prices...</h1>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (errorMsg) {
    return (
      <Layout>
        <section className={styles.page}>
          <div className="container">
            <div className={styles.header}>
              <h1 className={styles.title}>Error</h1>
              <p className={styles.subtitle} style={{ color: 'var(--out-of-stock, #7f1d1d)', marginTop: '1rem' }}>
                {errorMsg}
              </p>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className={styles.page}>
        <div className="container">
          <div className={styles.header}>
            <span className={styles.eyebrow}>QR Store Menu</span>
            <h1 className={styles.title}>In-Store Candle Prices</h1>
            <p className={styles.subtitle}>
              Quick pricing for our core candle lineup. Ask in-store for seasonal editions and bundle offers.
            </p>
          </div>

          <div className={styles.grid}>
            {candles.map((item) => (
              <article
                key={item.id}
                className={styles.card}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedId(item.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedId(item.id);
                  }
                }}
                aria-label={`Open details for ${item.name}`}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className={styles.cardImage}
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                )}
                <div className={styles.top}>
                  <h2 className={styles.name}>{item.name}</h2>
                  <span className={styles.price}>{item.price}</span>
                </div>
                <p className={styles.meta}>{item.size} · {item.burnTime}</p>
                <p className={styles.notes}>{item.notes}</p>
                <span className={`${styles.stockBadge} ${item.inStock ? styles.inStock : styles.outOfStock}`}>
                  {item.inStock ? 'In Stock' : 'Sold Out'}
                </span>
              </article>
            ))}
          </div>

          {selectedItem && (
            <div className={styles.modalOverlay} onClick={() => setSelectedId(null)}>
              <div
                className={styles.modalCard}
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={`${selectedItem.name} details`}
              >
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={() => setSelectedId(null)}
                  aria-label="Close details"
                >
                  Close
                </button>

                {selectedItem.image && (
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className={styles.modalImage}
                    loading="eager"
                    decoding="async"
                  />
                )}

                <div className={styles.top}>
                  <h2 className={styles.name}>{selectedItem.name}</h2>
                  <span className={styles.price}>{selectedItem.price}</span>
                </div>
                <p className={styles.meta}>{selectedItem.size} · {selectedItem.burnTime}</p>
                <p className={styles.notes}>{selectedItem.notes}</p>
                {selectedItem.details && <p className={styles.details}>{selectedItem.details}</p>}
                
                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <span className={`${styles.stockBadge} ${selectedItem.inStock ? styles.inStock : styles.outOfStock}`}>
                    {selectedItem.inStock ? 'In Stock' : 'Sold Out'}
                    </span>
                    <Button 
                        variant="primary" 
                        disabled={!selectedItem.inStock}
                        onClick={() => {
                            addItem(selectedItem);
                            setSelectedId(null);
                        }}
                    >
                        {selectedItem.inStock ? 'Add to Cart' : 'Unavailable'}
                    </Button>
                </div>
              </div>
            </div>
          )}

          <div className={styles.footer}>
            <p className={styles.disclaimer}>Prices shown are in-store retail and may change by season.</p>
            <div className={styles.actions}>
              <Button variant="secondary" onClick={() => navigate('/shop')}>Full Catalog</Button>
              <Button variant="primary" onClick={() => navigate('/')}>Brand Story</Button>
              <Button
                variant="secondary"
                onClick={() => window.open(INSTAGRAM_URL, '_blank', 'noopener,noreferrer')}
              >
                Instagram
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CandlePricingPage;
