/* global process */
import { randomUUID } from 'node:crypto';
import Stripe from 'stripe';
import { sendError } from './_commerce.js';

export default async function handler(req, res) {
  const requestId = randomUUID();

  if (req.method !== 'GET') {
    res.setHeader?.('Allow', 'GET');
    return sendError(res, 405, { code: 'method_not_allowed', message: 'Method not allowed.' }, requestId);
  }

  const sessionId = typeof req.query?.session_id === 'string' ? req.query.session_id : '';
  if (!/^cs_(test_|live_)[A-Za-z0-9]+$/.test(sessionId)) {
    return sendError(res, 400, {
      code: 'invalid_session',
      message: 'This checkout confirmation link is invalid.',
    }, requestId);
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return sendError(res, 503, {
      code: 'verification_unavailable',
      message: 'Order verification is temporarily unavailable. Please try again shortly.',
    }, requestId);
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const verified = session.status === 'complete' && session.payment_status === 'paid';

    if (!verified) {
      return sendError(res, 409, {
        code: 'payment_not_confirmed',
        message: 'Payment has not been confirmed for this checkout.',
      }, requestId);
    }

    return res.status(200).json({
      verified: true,
      reference: session.id.slice(-10).toUpperCase(),
      amountTotal: session.amount_total,
      currency: session.currency,
    });
  } catch (error) {
    console.error('Checkout verification failed', { requestId, type: error?.type || error?.name });
    return sendError(res, 404, {
      code: 'session_not_found',
      message: 'We could not verify this checkout. No confirmation has been shown.',
    }, requestId);
  }
}
