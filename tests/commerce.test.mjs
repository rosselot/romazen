import test from 'node:test';
import assert from 'node:assert/strict';
import { getSiteUrl, parseUnitAmount, validateCart } from '../api/_commerce.js';
import {
  applyBundleDiscountToUnitAmount,
  getBundleDiscountBps,
  qualifiesForFreeShipping,
} from '../src/data/commerce.js';
import { CANDLE_FORM_IDS, normalizeCandleRecord } from '../src/data/candlePrices.js';

test('checkout input rejects malformed and excessive quantities', () => {
  assert.equal(validateCart({}).error.code, 'invalid_cart');
  assert.equal(validateCart({ items: [{ id: 'candle', quantity: 1.5 }] }).error.code, 'invalid_item');
  assert.equal(validateCart({ items: [{ id: 'candle', quantity: 11 }] }).error.code, 'invalid_item');
  assert.deepEqual(validateCart({ items: [{ id: 'candle', quantity: 2 }] }).items, [
    { id: 'candle', quantity: 2 },
  ]);
});

test('catalog prices and redirect origins are normalized safely', () => {
  assert.equal(parseUnitAmount('$52.00'), 5200);
  assert.equal(parseUnitAmount('free'), null);
  assert.equal(getSiteUrl({ SITE_URL: 'https://www.romazen.com/path' }), 'https://www.romazen.com');
  assert.equal(getSiteUrl({ SITE_URL: 'javascript:alert(1)' }), null);
  assert.equal(getSiteUrl({ NODE_ENV: 'production' }), null);
});

test('bundle savings and free shipping use the advertised thresholds', () => {
  assert.equal(getBundleDiscountBps(1), 0);
  assert.equal(getBundleDiscountBps(2), 1000);
  assert.equal(getBundleDiscountBps(3), 1200);
  assert.equal(getBundleDiscountBps(4), 1500);
  assert.equal(applyBundleDiscountToUnitAmount(5200, 2), 4680);
  assert.equal(qualifiesForFreeShipping(9999), false);
  assert.equal(qualifiesForFreeShipping(10000), true);
});

test('the four-form offer stays authoritative over legacy catalog labels', () => {
  const arch = normalizeCandleRecord({
    id: 'roman-marble-8oz',
    name: 'Legacy Name',
    price: '$1.00',
    notes: 'Legacy notes',
    inStock: true,
  });

  assert.equal(arch.name, 'The Arch');
  assert.equal(arch.price, '$52.00');
  assert.equal(arch.notes, 'Gardenia · Jasmine');
});

test('the compact forms have authoritative sales details', () => {
  const ripple = normalizeCandleRecord({ id: 'ripple-compact', inStock: true });
  const atrium = normalizeCandleRecord({ id: 'atrium-lidded', inStock: true });

  assert.equal(CANDLE_FORM_IDS.length, 6);
  assert.equal(ripple.name, 'The Ripple');
  assert.equal(ripple.price, '$42.00');
  assert.equal(ripple.dimensions, '3½″ H × 3½″ W');
  assert.equal(ripple.galleryImages.length, 7);
  assert.match(ripple.image, /ripple-signature/);
  assert.equal(atrium.name, 'The Atrium');
  assert.equal(atrium.price, '$58.00');
  assert.equal(atrium.dimensions, '3½″ H × 3½″ W');
  assert.equal(atrium.galleryImages.length, 7);
  assert.match(atrium.image, /atrium-cloche-signature/);
  assert.match(atrium.galleryImages[3].src, /atrium-cloche-evening-v2/);
  assert.match(atrium.details, /complete bell-jar glass jacket/i);
});
