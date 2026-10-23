const Product = require('../models/Product');
const { SAREE_TYPES } = require('../data/catalogOptions');

const SORTS = {
  popular: { popularity: -1, createdAt: -1 },
  new: { createdAt: -1 },
  'price-asc': { price: 1, popularity: -1 },
  'price-desc': { price: -1, popularity: -1 },
};

// "a,b , c" -> ['a', 'b', 'c']
const listParam = (value) =>
  typeof value === 'string'
    ? value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
        .slice(0, 20)
    : [];

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const numberParam = (value) => {
  const n = Number(value);
  return value !== undefined && value !== '' && Number.isFinite(n) ? n : null;
};

// Type filter takes slugs (?type=jamdani,muslin) so URLs stay readable
const typeNamesFor = (slugs) =>
  SAREE_TYPES.filter((type) => slugs.includes(type.slug)).map((type) => type.name);

/**
 * Builds the Mongo filter from the query string. `omit` leaves one facet out, so the type
 * counts can be computed "as if no type were picked" (the usual faceted-search behaviour).
 */
const buildFilter = (query, omit) => {
  const filter = { active: true };

  const types = typeNamesFor(listParam(query.type));
  if (types.length && omit !== 'type') filter.type = { $in: types };

  const fabrics = listParam(query.fabric);
  if (fabrics.length) filter.fabric = { $in: fabrics };

  const colors = listParam(query.color);
  if (colors.length) filter.colors = { $in: colors };

  const occasions = listParam(query.occasion);
  if (occasions.length) filter.occasions = { $in: occasions };

  const minPrice = numberParam(query.minPrice);
  const maxPrice = numberParam(query.maxPrice);
  if (minPrice !== null || maxPrice !== null) {
    filter.price = {};
    if (minPrice !== null) filter.price.$gte = minPrice;
    if (maxPrice !== null) filter.price.$lte = maxPrice;
  }

  if (query.blouse === 'true') filter.withBlousePiece = true;
  if (query.handwoven === 'true') filter.handwoven = true;
  if (query.isNew === 'true') filter.isNewArrival = true;
  if (query.best === 'true') filter.bestSeller = true;

  const q = typeof query.q === 'string' ? query.q.trim().slice(0, 60) : '';
  if (q) {
    // Every word must match the name (English or Bangla), type, fabric, colour or occasion
    filter.$and = q.split(/\s+/).map((word) => {
      // Match at the start of a word, so "red" does not find "scattered"
      const re = new RegExp(`(^|[^a-z])${escapeRegex(word)}`, 'i');
      return {
        $or: [
          { name: re },
          { nameBn: re },
          { type: re },
          { fabric: re },
          { weave: re },
          { colors: re },
          { occasions: re },
        ],
      };
    });
  }

  return filter;
};

// @desc    List sarees with search, filters, sorting and saree-type facet counts
// @route   GET /api/products?q=&type=jamdani,muslin&fabric=&color=&occasion=&minPrice=&maxPrice=&blouse=true&handwoven=true&sort=popular&limit=
// @access  Public
const getProducts = async (req, res) => {
  try {
    const sort = SORTS[req.query.sort] || SORTS.popular;
    const limit = Math.min(Math.max(numberParam(req.query.limit) || 100, 1), 100);
    const filter = buildFilter(req.query);

    const [products, typeCounts] = await Promise.all([
      Product.find(filter).sort(sort).limit(limit),
      Product.aggregate([
        { $match: buildFilter(req.query, 'type') },
        { $group: { _id: '$type', count: { $sum: 1 } } },
      ]),
    ]);

    const types = Object.fromEntries(SAREE_TYPES.map((type) => [type.slug, 0]));
    typeCounts.forEach(({ _id, count }) => {
      const type = SAREE_TYPES.find((t) => t.name === _id);
      if (type) types[type.slug] = count;
    });

    res.json({ products, total: products.length, facets: { types } });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get one saree by slug, with up to 4 related sarees (same type first)
// @route   GET /api/products/:slug
// @access  Public
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, active: true });
    if (!product) {
      return res.status(404).json({ message: 'Saree not found' });
    }
    const sameType = await Product.find({
      active: true,
      type: product.type,
      _id: { $ne: product._id },
    })
      .sort(SORTS.popular)
      .limit(4);
    const related =
      sameType.length >= 4
        ? sameType
        : sameType.concat(
            await Product.find({
              active: true,
              _id: { $nin: [product._id, ...sameType.map((p) => p._id)] },
              occasions: { $in: product.occasions },
            })
              .sort(SORTS.popular)
              .limit(4 - sameType.length),
          );
    res.json({ product, related });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProducts, getProductBySlug };
