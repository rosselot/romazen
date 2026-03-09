/* global process */
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { STORE_CANDLE_PRICES, normalizeCandleRecord } from '../src/data/candlePrices.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

let supabaseUrl = (process.env.VITE_SUPABASE_URL || '').replace(/['"]/g, '').trim();
let supabaseAnonKey = (process.env.VITE_SUPABASE_ANON_KEY || '').replace(/['"]/g, '').trim();

if (supabaseUrl && !supabaseUrl.startsWith('http')) {
  supabaseUrl = `https://${supabaseUrl}`;
}

// Initialize Supabase client only if vars exist
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const buildCatalogMap = (items) =>
  new Map(
    items
      .map(normalizeCandleRecord)
      .filter(Boolean)
      .map((item) => [String(item.id), item]),
  );

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { items } = req.body;

    const fallbackCatalog = buildCatalogMap(STORE_CANDLE_PRICES);
    const requestedIds = items.map((item) => String(item.id));
    const catalog = new Map(fallbackCatalog);

    if (supabase) {
      const { data: dbProducts, error } = await supabase
        .from('products')
        .select('*')
        .in('id', requestedIds);

      if (!error && dbProducts) {
        buildCatalogMap(dbProducts).forEach((value, key) => {
          catalog.set(key, value);
        });
      } else if (error) {
        console.warn('Falling back to local candle catalog for checkout.', error.message);
      }
    }

    // Validate and format items for Stripe Checkout
    const lineItems = items.map((item) => {
      // Find the authoritative product on the server (prevent client price manipulation)
      const serverProduct = catalog.get(String(item.id));
      
      if (!serverProduct) {
         throw new Error(`Product ${item.id} not found.`);
      }

      // Format price correctly to cents
      const unitAmount = Math.round(Number.parseFloat(serverProduct.price.replace(/[^0-9.]/g, '')) * 100);
      const siteUrl = process.env.SITE_URL || req.headers.origin || 'http://localhost:4173';

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: serverProduct.name,
            images: serverProduct.image ? [new URL(serverProduct.image, siteUrl).toString()] : [],
            description: serverProduct.description || serverProduct.notes,
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'], // Add your shipping countries
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 500, currency: 'usd' },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
      ],
      // Redirects based on success/cancellation
      success_url: `${req.headers.origin || 'http://localhost:4173'}?checkout=success`,
      cancel_url: `${req.headers.origin || 'http://localhost:4173'}?checkout=cancelled`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Session Error:', error);
    res.status(500).json({ error: error.message });
  }
}
