/* global process */
export const MAX_LINE_ITEMS = 10;
export const MAX_ITEM_QUANTITY = 10;
export const MAX_CART_QUANTITY = 25;

export const validateCart = (body) => {
  if (!body || !Array.isArray(body.items) || body.items.length < 1) {
    return { error: { code: 'invalid_cart', message: 'Your cart is empty or invalid.' } };
  }

  if (body.items.length > MAX_LINE_ITEMS) {
    return { error: { code: 'cart_too_large', message: 'Your cart contains too many different items.' } };
  }

  const items = [];
  let totalQuantity = 0;

  for (const [index, item] of body.items.entries()) {
    const id = typeof item?.id === 'string' ? item.id.trim() : '';
    const quantity = Number(item?.quantity);

    if (!id || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_ITEM_QUANTITY) {
      return {
        error: {
          code: 'invalid_item',
          message: 'One of the cart items has an invalid product or quantity.',
          itemIndex: index,
        },
      };
    }

    totalQuantity += quantity;
    items.push({ id, quantity });
  }

  if (totalQuantity > MAX_CART_QUANTITY) {
    return { error: { code: 'cart_quantity_exceeded', message: 'Please reduce the total cart quantity.' } };
  }

  return { items };
};

export const parseUnitAmount = (value) => {
  const amount = typeof value === 'number'
    ? value
    : Number.parseFloat(String(value ?? '').replace(/[^0-9.]/g, ''));
  const cents = Math.round(amount * 100);
  return Number.isSafeInteger(cents) && cents > 0 ? cents : null;
};

export const getSiteUrl = (env = process.env) => {
  const value = env.SITE_URL || (env.NODE_ENV === 'production' ? '' : 'http://localhost:4173');

  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.origin : null;
  } catch {
    return null;
  }
};

export const sendError = (res, status, error, requestId) =>
  res.status(status).json({ ...error, requestId });
