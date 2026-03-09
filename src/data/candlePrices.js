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

const parseStock = (value, fallback = true) => {
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

export const normalizeCandleRecord = (record) => {
  if (!record) {
    return null;
  }

  return {
    id: String(record.id),
    name: record.name ?? 'Romazen Candle',
    size: record.size ?? record.size_label ?? record.sizeLabel ?? 'Signature size',
    burnTime: record.burnTime ?? record.burn_time ?? record.burnTimeHours ?? 'Approx. 50 hrs',
    price: formatPrice(record.price),
    notes: record.notes ?? record.scent_notes ?? record.scentNotes ?? record.description ?? 'Seasonal scent notes',
    image: record.image ?? record.image_url ?? record.imageUrl ?? '/assets/images/hero-bg.png',
    inStock: parseStock(record.inStock ?? record.in_stock ?? record.available, true),
    details: record.details ?? record.long_description ?? record.description ?? null,
    description: record.description ?? record.details ?? record.long_description ?? null,
  };
};

export const STORE_CANDLE_PRICES = [
  {
    id: 'roman-marble-8oz',
    name: 'A Roma in Marble',
    size: '8 oz',
    burnTime: '45-50 hrs',
    price: '$45.00',
    notes: 'White tea, soft musk, clean cotton',
    image: '/assets/images/NoHexagonalOnBooks.jpeg',
    inStock: true,
    details: 'Our signature marble-glass profile with clean throw and balanced softness. Available now in-store.',
    description: 'White tea, soft musk, and clean cotton in our signature marble-glass candle.',
  },
  {
    id: 'midnight-fig-62oz',
    name: 'Midnight Fig',
    size: '62 oz',
    burnTime: '85-90 hrs',
    price: '$89.00',
    notes: 'Wild fig, cedarwood, green leaves',
    image: '/assets/images/RomaTallGarden.jpeg',
    inStock: true,
    details: 'A large-format candle for statement spaces, available now in 62 oz.',
    description: 'A large-format candle with wild fig, cedarwood, and green leaves.',
  },
  {
    id: 'silk-santal-33oz',
    name: 'Silk & Santal',
    size: '33 oz',
    burnTime: '55-60 hrs',
    price: '$48.00',
    notes: 'Sandalwood, white silk, vanilla',
    image: '/assets/images/PhotoCandlethird.jpeg',
    inStock: true,
    details: 'A smooth sandalwood profile with soft vanilla warmth in our 33 oz vessel.',
    description: 'Sandalwood, white silk, and vanilla in a soft, warm 33 oz candle.',
  },
  {
    id: 'wall-street-smoke-45oz',
    name: 'New York Smoke',
    size: '45 oz',
    burnTime: '65-70 hrs',
    price: '$68.00',
    notes: 'Tobacco leaf, oud, black tea',
    image: '/assets/images/CandleNotHexagonalCarlota.jpeg',
    inStock: true,
    details: 'A darker profile with tobacco leaf, oud, and black tea for evening spaces.',
    description: 'A moody candle with tobacco leaf, oud, and black tea.',
  },
].map(normalizeCandleRecord);
