const { TYPE_NAMES, FABRICS, OCCASIONS, COLORS } = require('../data/catalogOptions');

// "Raatrani Black Jamdani" -> "raatrani-black-jamdani"
const slugify = (text) =>
  String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

const text = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : undefined);
const number = (value) => (value === '' || value === null ? NaN : Number(value));
const bool = (value) => (typeof value === 'boolean' ? value : undefined);
const pick = (value, allowed) =>
  Array.isArray(value) ? [...new Set(value)].filter((v) => allowed.includes(v)) : [];

// Seed photos live in the frontend's public/products folder; uploads come from Cloudinary
const isImageUrl = (url) =>
  /^\/products\/[a-z0-9-]+\.(webp|jpe?g|png)$/i.test(url) ||
  /^https:\/\/res\.cloudinary\.com\/[^\s"'<>]+$/.test(url);

const readImages = (value) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((image) => {
      const url = text(image?.url, 400);
      if (!url || !isImageUrl(url)) return null;
      const credit = image.credit && typeof image.credit === 'object' ? image.credit : null;
      return {
        url,
        alt: text(image.alt, 240) || '',
        credit: credit
          ? {
              author: text(credit.author, 120) || '',
              license: text(credit.license, 40) || '',
              licenseUrl: text(credit.licenseUrl, 300) || '',
              source: text(credit.source, 400) || '',
            }
          : null,
      };
    })
    .filter(Boolean)
    .slice(0, 8);
};

/**
 * Whitelists and checks a saree from the admin form. `partial` (PUT) only checks the
 * fields that are present. Returns { data, errors }.
 */
const readProductInput = (body = {}, { partial = false } = {}) => {
  const data = {};
  const errors = {};
  const has = (key) => body[key] !== undefined;

  if (!partial || has('name')) {
    const name = text(body.name, 120);
    if (!name || name.length < 3) errors.name = 'Enter a saree name';
    else data.name = name;
  }
  if (has('nameBn')) data.nameBn = text(body.nameBn, 120) || '';
  if (has('slug') || (!partial && data.name)) {
    const slug = slugify(body.slug || data.name);
    if (!slug) errors.slug = 'Enter a URL name';
    else data.slug = slug;
  }
  if (!partial || has('type')) {
    if (!TYPE_NAMES.includes(body.type)) errors.type = 'Choose a saree type';
    else data.type = body.type;
  }
  if (!partial || has('fabric')) {
    if (!FABRICS.includes(body.fabric)) errors.fabric = 'Choose a fabric';
    else data.fabric = body.fabric;
  }
  if (has('weave')) data.weave = text(body.weave, 120) || '';
  if (has('origin')) data.origin = text(body.origin, 120) || '';
  if (!partial || has('price')) {
    const price = number(body.price);
    if (!Number.isFinite(price) || price < 0 || price > 1000000) errors.price = 'Enter a price';
    else data.price = Math.round(price);
  }
  if (!partial || has('originalPrice')) {
    const original = has('originalPrice') ? number(body.originalPrice) : data.price;
    if (!Number.isFinite(original) || original < 0) errors.originalPrice = 'Enter the old price';
    else data.originalPrice = Math.round(original);
  }
  if (
    data.price !== undefined &&
    data.originalPrice !== undefined &&
    data.originalPrice < data.price
  ) {
    errors.originalPrice = 'The old price must be at least the selling price';
  }
  if (!partial || has('colors')) {
    data.colors = pick(
      body.colors,
      COLORS.map((c) => c.name),
    );
    if (!data.colors.length) errors.colors = 'Pick at least one colour';
  }
  if (!partial || has('occasions')) data.occasions = pick(body.occasions, OCCASIONS);
  if (has('length') && body.length && typeof body.length === 'object') {
    const saree = number(body.length.sareeMetres);
    const blouse = number(body.length.blouseMetres);
    if (!Number.isFinite(saree) || saree < 4 || saree > 7) errors.length = 'Saree length 4 to 7 m';
    else if (!Number.isFinite(blouse) || blouse < 0 || blouse > 1.5) {
      errors.length = 'Blouse piece 0 to 1.5 m';
    } else data.length = { sareeMetres: saree, blouseMetres: blouse };
  }
  if (has('images') || !partial) data.images = readImages(body.images);
  if (has('care')) data.care = text(body.care, 600) || '';
  if (has('description')) data.description = text(body.description, 800) || '';
  if (has('popularity')) {
    const popularity = number(body.popularity);
    if (Number.isFinite(popularity)) data.popularity = Math.max(0, Math.round(popularity));
  }
  for (const flag of ['withBlousePiece', 'handwoven', 'isNewArrival', 'bestSeller', 'active']) {
    if (bool(body[flag]) !== undefined) data[flag] = body[flag];
  }

  return { data, errors };
};

module.exports = { readProductInput, slugify, isImageUrl };
