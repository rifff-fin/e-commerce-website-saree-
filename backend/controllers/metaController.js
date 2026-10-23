const {
  SAREE_TYPES,
  FABRICS,
  OCCASIONS,
  COLORS,
  DEFAULT_LENGTH,
  FALL_PICO_PRICE,
} = require('../data/catalogOptions');
const { DIVISIONS } = require('../data/districts');
const { DELIVERY_FEES, DELIVERY_DAYS, MAX_QTY_PER_LINE } = require('../services/pricingService');
const Banner = require('../models/Banner');

// Store configuration the frontend needs (shared with the offline demo snapshot)
const storeMeta = () => ({
  types: SAREE_TYPES,
  fabrics: FABRICS,
  occasions: OCCASIONS,
  colors: COLORS,
  priceRange: { min: 1500, max: 45000 },
  defaultLength: DEFAULT_LENGTH,
  fallPicoPrice: FALL_PICO_PRICE,
  divisions: DIVISIONS,
  delivery: { fees: DELIVERY_FEES, days: DELIVERY_DAYS },
  maxQtyPerLine: MAX_QTY_PER_LINE,
});

// @desc    Store configuration: filter options, districts, delivery fees, add-on price
// @route   GET /api/meta
// @access  Public
const getMeta = (req, res) => {
  // Static data: let browsers and the Netlify edge cache it for an hour
  res.set('Cache-Control', 'public, max-age=3600');
  res.json(storeMeta());
};

// @desc    Active homepage banners, in order
// @route   GET /api/meta/banners
// @access  Public
const getBanners = async (req, res) => {
  try {
    res.set('Cache-Control', 'public, max-age=120');
    res.json(await Banner.find({ active: true }).sort({ order: 1, createdAt: 1 }).limit(6));
  } catch (error) {
    console.error('Get banners error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMeta, getBanners, storeMeta };
