const formatPrice = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `$${value.toFixed(2)}`;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();

    if (!trimmed) {
      return '$0.00';
    }

    if (trimmed.startsWith('$') || trimmed.toLowerCase().startsWith('from $')) {
      return trimmed;
    }

    const amount = Number.parseFloat(trimmed.replace(/[^0-9.]/g, ''));
    if (Number.isFinite(amount)) {
      return `$${amount.toFixed(2)}`;
    }
  }

  return '$0.00';
};

const parseStock = (value, fallback = false) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value > 0;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'in stock', 'available'].includes(normalized)) {
      return true;
    }
    if (['false', '0', 'no', 'sold out', 'unavailable'].includes(normalized)) {
      return false;
    }
  }

  return fallback;
};

const LABEL_PHOTOS = {
  'ripple-compact': {
    image: '/assets/images/romazen-ripple-signature.jpeg',
    imageWidth: 1254,
    galleryImages: [
      { src: '/assets/images/romazen-ripple-signature.jpeg', width: 1254, alt: 'The Ripple candle in the RomaZen signature studio setting' },
      { src: '/assets/images/romazen-ripple-roman.jpeg', width: 1254, alt: 'The Ripple candle with a Roman arch light treatment' },
      { src: '/assets/images/romazen-ripple-morning.jpeg', width: 1254, alt: 'The Ripple candle in a quiet morning ritual setting' },
      { src: '/assets/images/romazen-ripple-evening.jpeg', width: 1254, alt: 'The Ripple candle burning in an evening setting' },
      { src: '/assets/images/romazen-ripple-detail.jpeg', width: 1254, alt: 'Close detail of The Ripple glass, wax, wick, and gold RomaZen mark' },
      { src: '/assets/images/romazen-ripple-gift.jpeg', width: 1254, alt: 'The Ripple candle presented as a refined gift' },
      { src: '/assets/images/romazen-ripple-pair-v2.jpeg', width: 1254, alt: 'Two Ripple candles arranged as a sculptural pair' },
    ],
  },
  'atrium-lidded': {
    image: '/assets/images/romazen-atrium-signature.jpeg',
    imageWidth: 1254,
    galleryImages: [
      { src: '/assets/images/romazen-atrium-signature.jpeg', width: 1254, alt: 'The Atrium candle in the RomaZen signature studio setting' },
      { src: '/assets/images/romazen-atrium-roman.jpeg', width: 1254, alt: 'The Atrium candle with a Roman arch light treatment' },
      { src: '/assets/images/romazen-atrium-morning.jpeg', width: 1254, alt: 'The Atrium candle in a quiet morning ritual setting' },
      { src: '/assets/images/romazen-atrium-evening.jpeg', width: 1254, alt: 'The Atrium candle burning with its glass lid beside it' },
      { src: '/assets/images/romazen-atrium-detail.jpeg', width: 1254, alt: 'Close detail of The Atrium lid, glass, wax, wick, and gold RomaZen mark' },
      { src: '/assets/images/romazen-atrium-gift.jpeg', width: 1254, alt: 'The Atrium candle presented as a refined gift' },
      { src: '/assets/images/romazen-atrium-pair.jpeg', width: 1254, alt: 'Two lidded Atrium candles arranged as a sculptural pair' },
    ],
  },
  'silk-santal-33oz': { image: '/assets/images/romazen-limited-size-1.jpeg', imageWidth: 1254 },
  'roman-marble-8oz': { image: '/assets/images/romazen-limited-size-2.jpeg', imageWidth: 1254 },
  'midnight-fig-62oz': { image: '/assets/images/romazen-limited-size-3.jpeg', imageWidth: 1254 },
  'wall-street-smoke-45oz': { image: '/assets/images/romazen-limited-size-4.jpeg', imageWidth: 1254 },
  'Familia 1': { image: '/assets/images/romazen-limited-four-sizes.jpeg', imageWidth: 1122 },
};

const COLLECTION_DETAILS = {
  'ripple-compact': {
    name: 'The Ripple',
    edition: 'The Intimate Forms',
    vesselLabel: 'Compact I',
    dimensions: '3½″ H × 3½″ W',
    order: 1,
    size: 'Sculpted compact form',
    price: 42,
    notes: 'Gardenia · Jasmine',
    details: 'A fluid, tactile glass silhouette designed for bedside tables, baths, desks, and effortless gifting.',
    description: 'A compact sculpted-glass soy candle with luminous gardenia and soft jasmine notes.',
  },
  'atrium-lidded': {
    name: 'The Atrium',
    edition: 'The Intimate Forms',
    vesselLabel: 'Compact II',
    dimensions: '3½″ H × 3½″ W',
    order: 2,
    size: 'Lidded compact form',
    price: 58,
    notes: 'Gardenia · Jasmine',
    details: 'A polished lidded form that protects the wax between burns and arrives naturally ready to gift.',
    description: 'A premium lidded soy candle with luminous gardenia and soft jasmine notes.',
  },
  'silk-santal-33oz': {
    name: 'The Halo',
    edition: 'The Four Forms',
    vesselLabel: 'Form I',
    dimensions: '3½″ H × 4″ W',
    order: 3,
    size: 'Petite form',
    price: 38,
    notes: 'Gardenia · Jasmine',
    details: 'An intimate floral ritual for a bedside table, bath, or thoughtful gift.',
    description: 'A petite sculptural soy candle with luminous gardenia and soft jasmine notes.',
  },
  'roman-marble-8oz': {
    name: 'The Arch',
    edition: 'The Four Forms',
    vesselLabel: 'Form II',
    dimensions: '6″ H × 3⅜″ W',
    order: 4,
    size: 'Classic form',
    price: 52,
    notes: 'Gardenia · Jasmine',
    details: 'Our everyday hero: a balanced sculptural form for bedrooms, offices, and entryways.',
    description: 'A classic sculptural soy candle with luminous gardenia and soft jasmine notes.',
  },
  'midnight-fig-62oz': {
    name: 'The Column',
    edition: 'The Four Forms',
    vesselLabel: 'Form III',
    dimensions: '8″ H × 3½″ W',
    order: 5,
    size: 'Grand form',
    price: 74,
    notes: 'Gardenia · Jasmine',
    details: 'A taller floral statement designed to bring architectural presence to living and dining spaces.',
    description: 'A tall sculptural soy candle with luminous gardenia and soft jasmine notes.',
  },
  'wall-street-smoke-45oz': {
    name: 'The Monument',
    edition: 'The Four Forms',
    vesselLabel: 'Form IV',
    dimensions: '11″ H × 3½″ W',
    order: 6,
    size: 'Monumental form',
    price: 110,
    notes: 'Gardenia · Jasmine',
    details: 'The collection’s most dramatic form—an enduring floral centerpiece for expansive rooms and celebrations.',
    description: 'A monumental sculptural soy candle with luminous gardenia and soft jasmine notes.',
  },
  'Familia 1': {
    name: 'The Four Forms Set',
    edition: 'Complete Collection',
    vesselLabel: 'Forms I–IV',
    dimensions: 'Includes all four forms',
    order: 5,
    size: 'Complete four-form set',
    price: 232.90,
    notes: 'Gardenia · Jasmine',
    details: 'The complete architectural collection in RomaZen’s signature white-floral aroma.',
    description: 'All four sculptural soy candles with luminous gardenia and soft jasmine notes.',
  },
};

export const INTIMATE_FORM_IDS = [
  'ripple-compact',
  'atrium-lidded',
];

export const FOUR_FORM_IDS = [
  'silk-santal-33oz',
  'roman-marble-8oz',
  'midnight-fig-62oz',
  'wall-street-smoke-45oz',
];

export const CANDLE_FORM_IDS = [...INTIMATE_FORM_IDS, ...FOUR_FORM_IDS];

export const normalizeCandleRecord = (record) => {
  if (!record) {
    return null;
  }

  const id = String(record.id);
  const labelPhoto = LABEL_PHOTOS[id];
  const collection = COLLECTION_DETAILS[id];
  const stockCount = Number(record.stockCount ?? record.stock_count ?? record.inventory ?? record.quantity);

  return {
    id,
    name: collection?.name ?? record.name ?? 'RomaZen Candle',
    edition: collection?.edition ?? record.edition ?? 'The Four Forms',
    vesselLabel: collection?.vesselLabel ?? record.vesselLabel ?? record.vessel_label ?? null,
    dimensions: collection?.dimensions ?? record.dimensions ?? null,
    vesselOrder: collection?.order ?? 99,
    size: collection?.size ?? record.size ?? record.size_label ?? record.sizeLabel ?? 'Signature form',
    burnTime: collection ? null : (record.burnTime ?? record.burn_time ?? record.burnTimeHours ?? null),
    price: formatPrice(collection?.price ?? record.price),
    notes: collection?.notes ?? record.notes ?? record.scent_notes ?? record.scentNotes ?? record.description ?? 'Gardenia · Jasmine',
    image: labelPhoto?.image ?? record.image ?? record.image_url ?? record.imageUrl ?? '/assets/images/Living-Family.png',
    imageWidth: labelPhoto?.imageWidth ?? (Number(record.imageWidth ?? record.image_width) || 1024),
    galleryImages: labelPhoto?.galleryImages ?? [],
    inStock: parseStock(record.inStock ?? record.in_stock ?? record.available, true),
    stockCount: Number.isInteger(stockCount) && stockCount >= 0 ? stockCount : null,
    details: collection?.details ?? record.details ?? record.long_description ?? record.description ?? null,
    description: collection?.description ?? record.description ?? record.details ?? record.long_description ?? null,
  };
};

export const STORE_CANDLE_PRICES = CANDLE_FORM_IDS
  .map((id) => normalizeCandleRecord({ id, inStock: true }))
  .sort((a, b) => a.vesselOrder - b.vesselOrder);
