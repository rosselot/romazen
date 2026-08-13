import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Button from '../components/UI/Button';
import ResponsiveImage from '../components/UI/ResponsiveImage';
import { supabase } from '../utils/supabase';
import { INSTAGRAM_URL } from '../data/social';
import {
  CANDLE_FORM_IDS,
  FOUR_FORM_IDS,
  INTIMATE_FORM_IDS,
  STORE_CANDLE_PRICES,
  normalizeCandleRecord,
} from '../data/candlePrices';
import { FREE_SHIPPING_THRESHOLD, getBundleDiscountRate } from '../data/commerce';
import { usePageMeta } from '../hooks/usePageMeta';
import { useOverlayA11y } from '../hooks/useOverlayA11y';
import { useCart } from '../context/CartContext';
import styles from './CandlePricingPage.module.css';

const BUNDLE_OFFERS = [
  {
    id: 'intimate-pair',
    eyebrow: 'New compact duo',
    name: 'The Intimate Pair',
    formIds: INTIMATE_FORM_IDS,
    description: 'The sculpted Ripple and gift-ready Atrium—two compact expressions of the same white-floral ritual.',
  },
  {
    id: 'daily-ritual',
    eyebrow: 'Best first set',
    name: 'The Daily Ritual',
    formIds: ['silk-santal-33oz', 'roman-marble-8oz'],
    description: 'The Halo for intimate moments, paired with The Arch for everyday atmosphere.',
  },
  {
    id: 'roman-pair',
    eyebrow: 'Most popular',
    name: 'The Roman Pair',
    formIds: ['roman-marble-8oz', 'midnight-fig-62oz'],
    description: 'Two architectural heights designed to give a room rhythm, depth, and warm floral presence.',
  },
  {
    id: 'four-forms',
    eyebrow: 'Collector set',
    name: 'The Four Forms',
    formIds: FOUR_FORM_IDS,
    description: 'The complete silhouette—from the intimate Halo to the dramatic Monument.',
  },
];

const parseDisplayPrice = (price) => Number.parseFloat(String(price).replace(/[^0-9.]/g, '')) || 0;

const CandlePricingPage = () => {
  const navigate = useNavigate();
  const { addItem, addItems } = useCart();
  const [selectedId, setSelectedId] = React.useState(null);
  const [candles, setCandles] = React.useState(STORE_CANDLE_PRICES);
  const [catalogState, setCatalogState] = React.useState(
    supabase && import.meta.env.MODE !== 'test' ? 'checking' : 'fallback',
  );
  const modalRef = React.useRef(null);
  const closeButtonRef = React.useRef(null);
  const closeDetails = React.useCallback(() => setSelectedId(null), []);

  React.useEffect(() => {
    if (!supabase || import.meta.env.MODE === 'test') {
      return undefined;
    }

    let ignore = false;

    const fetchCandles = async () => {
      let query = supabase
        .from('products')
        .select('*')
        .order('name');
      if (typeof AbortSignal?.timeout === 'function') query = query.abortSignal(AbortSignal.timeout(6000));
      const { data, error } = await query;

      if (ignore) {
        return;
      }

      if (error) {
        if (import.meta.env.DEV) {
          console.warn('Falling back to local candle catalog because the remote fetch failed.', error);
        }
        setCatalogState('fallback');
        return;
      }

      const remoteCandles = (data || [])
        .map(normalizeCandleRecord)
        .filter(Boolean)
        .filter((item) => CANDLE_FORM_IDS.includes(item.id))
        .sort((a, b) => a.vesselOrder - b.vesselOrder);
      if (remoteCandles.length === CANDLE_FORM_IDS.length) {
        setCandles(remoteCandles);
        setCatalogState('live');
      } else {
        setCatalogState('fallback');
      }
    };

    fetchCandles();

    return () => {
      ignore = true;
    };
  }, []);

  const selectedItem = candles.find((item) => item.id === selectedId) ?? null;
  const selectedGallery = selectedItem?.galleryImages?.length
    ? selectedItem.galleryImages
    : selectedItem?.image
      ? [{ src: selectedItem.image, width: selectedItem.imageWidth, alt: selectedItem.name }]
      : [];
  const intimateForms = candles.filter((item) => INTIMATE_FORM_IDS.includes(item.id));
  const fourForms = candles.filter((item) => FOUR_FORM_IDS.includes(item.id));
  const bundleOffers = React.useMemo(() => BUNDLE_OFFERS.map((offer) => {
    const items = offer.formIds
      .map((id) => candles.find((candle) => candle.id === id))
      .filter(Boolean);
    const regularTotal = items.reduce((total, item) => total + parseDisplayPrice(item.price), 0);
    const discountRate = getBundleDiscountRate(items.length);

    return {
      ...offer,
      items,
      regularTotal,
      bundleTotal: regularTotal * (1 - discountRate),
      discountPercent: Math.round(discountRate * 100),
      shippingGap: Math.max(0, FREE_SHIPPING_THRESHOLD - (regularTotal * (1 - discountRate))),
      isAvailable: items.length === offer.formIds.length && items.every((item) => item.inStock),
    };
  }), [candles]);

  useOverlayA11y({
    isOpen: Boolean(selectedItem),
    containerRef: modalRef,
    initialFocusRef: closeButtonRef,
    onClose: closeDetails,
  });

  usePageMeta({
    title: 'Gardenia & Jasmine Soy Candles in Six Forms | RomaZen',
    description: 'Shop RomaZen Gardenia and Jasmine soy candles in two compact and four architectural glass forms. Sets save 10–15%; free standard shipping at $100.',
  });

  return (
    <Layout>
      <section className={styles.page}>
        <div className="container">
          <div className={styles.header}>
            <span className={styles.eyebrow}>The RomaZen Forms · Gardenia &amp; Jasmine</span>
            <h1 className={styles.title}>One Floral Ritual. Six Sculptural Forms.</h1>
            <p className={styles.subtitle}>
              Luminous gardenia opens into soft jasmine—a serene white-floral aroma, now hand-poured in two intimate and four architectural glass forms.
            </p>
            <div className={styles.collectionPromises} aria-label="Collection highlights">
              <span>Hand-poured soy</span>
              <span>Save 10–15% on sets</span>
              <span>Free standard shipping at ${FREE_SHIPPING_THRESHOLD}+</span>
            </div>
            <p
              className={`${styles.catalogStatus} ${catalogState === 'fallback' ? styles.catalogWarning : ''}`}
              role={catalogState === 'fallback' ? 'alert' : 'status'}
            >
              {catalogState === 'live' && 'Live prices and online availability verified.'}
              {catalogState === 'checking' && 'Verifying live prices and availability…'}
              {catalogState === 'fallback' && 'Live inventory is unavailable. These prices are a read-only in-store reference, and online checkout is paused.'}
            </p>
          </div>

          <section className={styles.collectionGroup} aria-labelledby="intimate-forms-heading">
            <div className={styles.groupHeader}>
              <span className={styles.eyebrow}>New · 3½″ H × 3½″ W</span>
              <h2 id="intimate-forms-heading">The Intimate Forms</h2>
              <p>Compact, tactile vessels made for personal rituals and polished gifting.</p>
            </div>
            <div className={`${styles.grid} ${styles.intimateGrid}`}>
              {intimateForms.map((item) => (
                <CandleCard
                  key={item.id}
                  item={item}
                  catalogState={catalogState}
                  onDetails={() => setSelectedId(item.id)}
                  onAdd={() => addItem(item)}
                />
              ))}
            </div>
          </section>

          <section className={styles.collectionGroup} aria-labelledby="four-forms-heading">
            <div className={styles.groupHeader}>
              <span className={styles.eyebrow}>The original architectural collection</span>
              <h2 id="four-forms-heading">The Four Forms</h2>
              <p>Four ascending silhouettes, from an intimate glow to a dramatic floral centerpiece.</p>
            </div>
            <div className={styles.grid}>
              {fourForms.map((item) => (
                <CandleCard
                  key={item.id}
                  item={item}
                  catalogState={catalogState}
                  onDetails={() => setSelectedId(item.id)}
                  onAdd={() => addItem(item)}
                />
              ))}
            </div>
          </section>

          <section className={styles.bundleSection} aria-labelledby="bundle-heading">
            <div className={styles.bundleHeader}>
              <span className={styles.eyebrow}>Build Your Ritual</span>
              <h2 id="bundle-heading" className={styles.bundleHeading}>Intelligent combinations, automatic savings</h2>
              <p className={styles.bundleIntro}>
                Choose any two and save 10%, three and save 12%, or four or more and save 15%. Savings appear automatically in your cart.
              </p>
            </div>
            <div className={styles.bundleGrid}>
              {bundleOffers.map((offer) => (
                <article key={offer.id} className={styles.bundleCard}>
                  <span className={styles.bundleEyebrow}>{offer.eyebrow}</span>
                  <h3>{offer.name}</h3>
                  <p>{offer.description}</p>
                  <p className={styles.bundleContents}>
                    {offer.items.map((item) => item.name).join(' + ')}
                  </p>
                  <div className={styles.bundlePriceRow}>
                    <span className={styles.regularPrice}>${offer.regularTotal.toFixed(2)}</span>
                    <strong>${offer.bundleTotal.toFixed(2)}</strong>
                    <span className={styles.savingsBadge}>Save {offer.discountPercent}%</span>
                  </div>
                  <p className={styles.bundleShipping}>
                    {offer.shippingGap === 0
                      ? 'Complimentary standard shipping unlocked.'
                      : `Add $${offer.shippingGap.toFixed(2)} more for complimentary standard shipping.`}
                  </p>
                  <Button
                    variant="dark"
                    disabled={catalogState !== 'live' || !offer.isAvailable}
                    onClick={() => addItems(offer.items)}
                  >
                    {catalogState !== 'live' ? 'Online checkout paused' : `Add ${offer.name}`}
                  </Button>
                </article>
              ))}
            </div>
          </section>

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

                <div className={selectedGallery.length > 1 ? styles.modalGallery : undefined}>
                  {selectedGallery.map((photo, index) => (
                    <ResponsiveImage
                      key={photo.src}
                      src={photo.src}
                      naturalWidth={photo.width}
                      alt={photo.alt}
                      className={styles.modalImage}
                      loading={index < 2 ? 'eager' : 'lazy'}
                      decoding="async"
                      sizes="(max-width: 640px) 100vw, 420px"
                    />
                  ))}
                </div>

                <p className={styles.edition}>
                  {selectedItem.edition}{selectedItem.vesselLabel && ` · ${selectedItem.vesselLabel}`}
                </p>
                <div className={styles.top}>
                  <h2 id="candle-details-title" className={styles.name}>{selectedItem.name}</h2>
                  <span className={styles.price}>{selectedItem.price}</span>
                </div>
                <p className={styles.meta}>{selectedItem.size}{selectedItem.burnTime && ` · ${selectedItem.burnTime}`}</p>
                {selectedItem.dimensions && <p className={styles.dimensions}>{selectedItem.dimensions}</p>}
                <p className={styles.notes}>{selectedItem.notes}</p>
                {selectedItem.details && <p className={styles.details}>{selectedItem.details}</p>}
                <p className={styles.details}>Trim the wick to ¼ inch before each burn. Never leave a burning candle unattended.</p>
                <p className={styles.commerceNote}>
                  Set savings apply automatically: 10% on two candles, 12% on three, and 15% on four or more. Free standard shipping at ${FREE_SHIPPING_THRESHOLD}+ after savings.
                </p>

                <div className={styles.purchaseActions}>
                    <span className={`${styles.stockBadge} ${catalogState === 'live' ? (selectedItem.inStock ? styles.inStock : styles.outOfStock) : styles.unverified}`}>
                    {catalogState === 'live' ? (selectedItem.inStock ? 'In Stock' : 'Sold Out') : 'Availability unverified'}
                    </span>
                    <Button
                        variant="dark"
                        disabled={!selectedItem.inStock || catalogState !== 'live'}
                        onClick={() => {
                            addItem(selectedItem);
                            closeDetails();
                        }}
                    >
                        {catalogState !== 'live'
                          ? 'Online checkout paused'
                          : selectedItem.inStock
                            ? 'Add to Cart'
                            : 'Unavailable'}
                    </Button>
                </div>
              </div>
            </div>
          )}

          <div className={styles.footer}>
            <p className={styles.disclaimer}>Prices shown in USD. Bundle savings and free-shipping eligibility are confirmed in your cart.</p>
            <div className={styles.actions}>
              <Button variant="outlineDark" onClick={() => navigate('/shop')}>Full Catalog</Button>
              <Button variant="dark" onClick={() => navigate('/')}>Brand Story</Button>
              <Button
                variant="outlineDark"
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

const CandleCard = ({ item, catalogState, onDetails, onAdd }) => (
  <article className={styles.card}>
    <button
      type="button"
      className={styles.cardButton}
      onClick={onDetails}
      aria-label={`Open details for ${item.name}`}
    >
      {item.image && (
        <ResponsiveImage
          src={item.image}
          naturalWidth={item.imageWidth}
          alt={item.name}
          className={styles.cardImage}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      )}
      <p className={styles.edition}>
        {item.edition}{item.vesselLabel && ` · ${item.vesselLabel}`}
      </p>
      <div className={styles.top}>
        <h3 className={styles.name}>{item.name}</h3>
        <span className={styles.price}>{item.price}</span>
      </div>
      <p className={styles.meta}>{item.size}{item.burnTime && ` · ${item.burnTime}`}</p>
      {item.dimensions && <p className={styles.dimensions}>{item.dimensions}</p>}
      <p className={styles.notes}>{item.notes}</p>
      <span className={`${styles.stockBadge} ${catalogState === 'live' ? (item.inStock ? styles.inStock : styles.outOfStock) : styles.unverified}`}>
        {catalogState === 'live' ? (item.inStock ? 'In Stock' : 'Sold Out') : 'Availability unverified'}
      </span>
      <span className={styles.viewDetails}>View details</span>
    </button>
    <div className={styles.quickAdd}>
      <Button
        variant="dark"
        disabled={catalogState !== 'live' || !item.inStock}
        onClick={onAdd}
      >
        {catalogState !== 'live' ? 'Checkout paused' : item.inStock ? `Add ${item.name}` : 'Sold out'}
      </Button>
    </div>
  </article>
);

export default CandlePricingPage;
