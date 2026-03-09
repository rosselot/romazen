import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Button from '../components/UI/Button';
import { supabase } from '../utils/supabase';
import { INSTAGRAM_URL } from '../data/social';
import { STORE_CANDLE_PRICES, normalizeCandleRecord } from '../data/candlePrices';
import { usePageMeta } from '../hooks/usePageMeta';
import { useOverlayA11y } from '../hooks/useOverlayA11y';
import { useCart } from '../context/CartContext';
import styles from './CandlePricingPage.module.css';

const CandlePricingPage = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [selectedId, setSelectedId] = React.useState(null);
  const [candles, setCandles] = React.useState(STORE_CANDLE_PRICES);
  const modalRef = React.useRef(null);
  const closeButtonRef = React.useRef(null);
  const closeDetails = React.useCallback(() => setSelectedId(null), []);

  React.useEffect(() => {
    if (!supabase || import.meta.env.MODE === 'test') {
      return undefined;
    }

    let ignore = false;

    const fetchCandles = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (ignore) {
        return;
      }

      if (error) {
        if (import.meta.env.DEV) {
          console.warn('Falling back to local candle catalog because the remote fetch failed.', error);
        }
        return;
      }

      const remoteCandles = (data || []).map(normalizeCandleRecord).filter(Boolean);
      if (remoteCandles.length > 0) {
        setCandles(remoteCandles);
      }
    };

    fetchCandles();

    return () => {
      ignore = true;
    };
  }, []);

  const selectedItem = candles.find((item) => item.id === selectedId) ?? null;

  useOverlayA11y({
    isOpen: Boolean(selectedItem),
    containerRef: modalRef,
    initialFocusRef: closeButtonRef,
    onClose: closeDetails,
  });

  usePageMeta({
    title: 'In-Store Candle Prices | Romazen',
    description: 'Scan-ready in-store Romazen candle pricing, sizes, and scent notes.',
  });

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
            <div className={styles.modalOverlay} onClick={closeDetails}>
              <div
                ref={modalRef}
                className={styles.modalCard}
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="candle-details-title"
                tabIndex={-1}
              >
                <button
                  ref={closeButtonRef}
                  type="button"
                  className={styles.closeButton}
                  onClick={closeDetails}
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
                  <h2 id="candle-details-title" className={styles.name}>{selectedItem.name}</h2>
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
                            closeDetails();
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
