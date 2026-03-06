import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Button from '../components/UI/Button';
import { STORE_CANDLE_PRICES } from '../data/candlePrices';
import { INSTAGRAM_URL } from '../data/social';
import { usePageMeta } from '../hooks/usePageMeta';
import styles from './CandlePricingPage.module.css';

const CandlePricingPage = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = React.useState(null);
  const selectedItem = STORE_CANDLE_PRICES.find((item) => item.id === selectedId) ?? null;

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
            {STORE_CANDLE_PRICES.map((item) => (
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
                <span className={`${styles.stockBadge} ${selectedItem.inStock ? styles.inStock : styles.outOfStock}`}>
                  {selectedItem.inStock ? 'In Stock' : 'Sold Out'}
                </span>
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
