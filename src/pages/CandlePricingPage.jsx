import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Button from '../components/UI/Button';
import { STORE_CANDLE_PRICES } from '../data/candlePrices';
import { usePageMeta } from '../hooks/usePageMeta';
import styles from './CandlePricingPage.module.css';

const CandlePricingPage = () => {
  const navigate = useNavigate();

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
              <article key={item.id} className={styles.card}>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className={styles.cardImage}
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <div className={styles.top}>
                  <h2 className={styles.name}>{item.name}</h2>
                  <span className={styles.price}>{item.price}</span>
                </div>
                <p className={styles.meta}>{item.size} · {item.burnTime}</p>
                <p className={styles.notes}>{item.notes}</p>
              </article>
            ))}
          </div>

          <div className={styles.footer}>
            <p className={styles.disclaimer}>Prices shown are in-store retail and may change by season.</p>
            <div className={styles.actions}>
              <Button variant="secondary" onClick={() => navigate('/shop')}>Full Catalog</Button>
              <Button variant="primary" onClick={() => navigate('/')}>Brand Story</Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CandlePricingPage;
