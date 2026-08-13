import { CART_VERSION, getCartTotal, readStoredCart, sanitizeCartItems, serializeCart } from './cart';

describe('cart storage', () => {
  it('recovers from malformed and stale data', () => {
    const storage = { getItem: () => '{broken' };
    expect(readStoredCart(storage)).toEqual([]);

    expect(sanitizeCartItems({ version: CART_VERSION, items: [
      { id: 'valid', name: 'Candle', price: '$52.00', quantity: 2 },
      { id: 'bad-quantity', name: 'Candle', price: '$52.00', quantity: 'many' },
      { id: 'bad-price', name: 'Candle', price: 'free', quantity: 1 },
    ] })).toEqual([
      { id: 'valid', name: 'Candle', price: '$52.00', quantity: 2, image: '', imageWidth: null, size: '', category: '' },
    ]);
  });

  it('drops stale carts and keeps current totals finite', () => {
    const staleStorage = { getItem: () => JSON.stringify({ version: 1, items: [{ id: 'old', name: 'Old Candle', price: '$45.00', quantity: 1 }] }) };
    expect(readStoredCart(staleStorage)).toEqual([]);

    const items = [{ id: 'candle', name: 'Candle', price: '$52.00', quantity: 10 }];
    const storage = { getItem: () => JSON.stringify({ version: CART_VERSION, items }) };
    const current = readStoredCart(storage);

    expect(current[0].quantity).toBe(10);
    expect(getCartTotal(current)).toBe(520);
    expect(JSON.parse(serializeCart(current)).version).toBe(CART_VERSION);
  });
});
