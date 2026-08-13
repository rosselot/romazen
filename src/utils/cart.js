export const MAX_ITEM_QUANTITY = 10;
export const CART_VERSION = 2;

const parsePrice = (value) => {
  if (typeof value !== 'string') return null;
  const amount = Number.parseFloat(value.replace(/[^0-9.]/g, ''));
  return Number.isFinite(amount) && amount > 0 ? amount : null;
};

export const sanitizeCartItems = (value) => {
  const items = value?.version === CART_VERSION ? value.items : [];

  if (!Array.isArray(items)) return [];

  return items.flatMap((item) => {
    const quantity = Number(item?.quantity);
    const price = parsePrice(item?.price);

    if (
      !item ||
      typeof item.id !== 'string' ||
      !item.id.trim() ||
      typeof item.name !== 'string' ||
      !item.name.trim() ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      price === null
    ) {
      return [];
    }

    return [{
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: Math.min(quantity, MAX_ITEM_QUANTITY),
      image: typeof item.image === 'string' ? item.image : '',
      imageWidth: Number.isFinite(Number(item.imageWidth)) ? Number(item.imageWidth) : null,
      size: typeof item.size === 'string' ? item.size : '',
      category: typeof item.category === 'string' ? item.category : '',
    }];
  });
};

export const readStoredCart = (storage) => {
  try {
    return sanitizeCartItems(JSON.parse(storage.getItem('romazen_cart') || '[]'));
  } catch {
    return [];
  }
};

export const serializeCart = (items) => JSON.stringify({ version: CART_VERSION, items });

export const getCartTotal = (items) => items.reduce((total, item) => {
  const price = parsePrice(item.price) ?? 0;
  return total + price * item.quantity;
}, 0);
