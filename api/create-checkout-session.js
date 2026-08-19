/* global process */
import { randomUUID } from 'node:crypto';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { normalizeCandleRecord } from '../src/data/candlePrices.js';
import {
  STANDARD_SHIPPING_CENTS,
  applyBundleDiscountToUnitAmount,
  getBundleDiscountBps,
  qualifiesForFreeShipping,
} from '../src/data/commerce.js';
import { getSiteUrl, parseUnitAmount, sendError, validateCart } from './_commerce.js';

let supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').replace(/['"]/g, '').trim();
const supabaseKey = (
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
).replace(/['"]/g, '').trim();

if (supabaseUrl && !supabaseUrl.startsWith('http')) {
  supabaseUrl = `https://${supabaseUrl}`;
}

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })
  : null;

const buildCatalogMap = (items) =>
  new Map(
    items
      .map(normalizeCandleRecord)
      .filter(Boolean)
      .map((item) => [String(item.id), item]),
  );

export default async function handler(req, res) {
  const requestId = randomUUID();

  if (req.method !== 'POST') {
    res.setHeader?.('Allow', 'POST');
    return sendError(res, 405, { code: 'method_not_allowed', message: 'Method not allowed.' }, requestId);
  }

  const validated = validateCart(req.body);
  if (validated.error) return sendError(res, 400, validated.error, requestId);

  const siteUrl = getSiteUrl();
  if (!siteUrl || !supabase || !process.env.STRIPE_SECRET_KEY) {
    return sendError(res, 503, {
      code: 'checkout_unavailable',
      message: 'Online checkout is temporarily unavailable. Your cart has been saved.',
    }, requestId);
  }

  try {
    const requestedIds = validated.items.map((item) => item.id);
    let query = supabase.from('products').select('*').in('id', requestedIds);
    if (typeof AbortSignal?.timeout === 'function') query = query.abortSignal(AbortSignal.timeout(6000));
    const { data: dbProducts, error } = await query;

    if (error || !dbProducts) {
      console.error('Catalog lookup failed', { requestId, code: error?.code || 'unknown' });
      return sendError(res, 503, {
        code: 'catalog_unavailable',
        message: 'We cannot verify current prices and availability. Please try again shortly.',
      }, requestId);
    }

    const catalog = buildCatalogMap(dbProducts);
    const lineItems = [];
    const totalQuantity = validated.items.reduce((total, item) => total + item.quantity, 0);
    const bundleDiscountBps = getBundleDiscountBps(totalQuantity);
    let checkoutSubtotalCents = 0;

    for (const item of validated.items) {
      const serverProduct = catalog.get(item.id);

      if (!serverProduct) {
        return sendError(res, 422, {
          code: 'product_unavailable',
          message: 'An item in your cart is no longer available.',
          itemId: item.id,
        }, requestId);
      }

      if (!serverProduct.inStock) {
        return sendError(res, 409, {
          code: 'out_of_stock',
          message: `${serverProduct.name} is currently sold out.`,
          itemId: item.id,
        }, requestId);
      }

      if (serverProduct.stockCount !== null && item.quantity > serverProduct.stockCount) {
        return sendError(res, 409, {
          code: 'insufficient_stock',
          message: `Only ${serverProduct.stockCount} ${serverProduct.name} available.`,
          itemId: item.id,
          availableQuantity: serverProduct.stockCount,
        }, requestId);
      }

      const unitAmount = parseUnitAmount(serverProduct.price);
      if (!unitAmount) {
        return sendError(res, 422, {
          code: 'invalid_catalog_price',
          message: 'An item cannot be purchased online right now.',
          itemId: item.id,
        }, requestId);
      }
      const discountedUnitAmount = applyBundleDiscountToUnitAmount(unitAmount, totalQuantity);
      checkoutSubtotalCents += discountedUnitAmount * item.quantity;

      let imageUrl;
      try {
        imageUrl = serverProduct.image ? new URL(serverProduct.image, siteUrl).toString() : null;
      } catch {
        imageUrl = null;
      }

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: serverProduct.name,
            images: imageUrl ? [imageUrl] : [],
            description: serverProduct.description || serverProduct.notes,
          },
          unit_amount: discountedUnitAmount,
        },
        quantity: item.quantity,
      });
    }

    const freeShipping = qualifiesForFreeShipping(checkoutSubtotalCents);

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: freeShipping ? 0 : STANDARD_SHIPPING_CENTS, currency: 'usd' },
            display_name: freeShipping ? 'Complimentary Standard Shipping' : 'Standard Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
      ],
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancelled`,
      metadata: {
        request_id: requestId,
        bundle_discount_bps: String(bundleDiscountBps),
        free_standard_shipping: String(freeShipping),
      },
    });

    return res.status(200).json({ url: session.url, requestId });
  } catch (error) {
    console.error('Checkout session creation failed', { requestId, type: error?.type || error?.name });
    return sendError(res, 502, {
      code: 'checkout_provider_error',
      message: 'Checkout could not be started. Your cart has been saved; please try again.',
    }, requestId);
  }
}
