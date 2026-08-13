export const FREE_SHIPPING_THRESHOLD_CENTS = 10000;
export const FREE_SHIPPING_THRESHOLD = FREE_SHIPPING_THRESHOLD_CENTS / 100;
export const STANDARD_SHIPPING_CENTS = 500;

export const getBundleDiscountBps = (quantity) => {
  if (quantity >= 4) return 1500;
  if (quantity === 3) return 1200;
  if (quantity === 2) return 1000;
  return 0;
};

export const getBundleDiscountRate = (quantity) => getBundleDiscountBps(quantity) / 10000;

export const applyBundleDiscountToUnitAmount = (unitAmount, quantity) => {
  const discountBps = getBundleDiscountBps(quantity);
  return Math.round((unitAmount * (10000 - discountBps)) / 10000);
};

export const qualifiesForFreeShipping = (subtotalCents) => (
  subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS
);
