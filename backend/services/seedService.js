const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Banner = require('../models/Banner');
const products = require('../data/products');
const coupons = require('../data/coupons');
const banners = require('../data/banners');
const { stableId } = require('../utils/stableId');

// A fixed date so "newest first" is stable: new arrivals are the most recent
const SEED_DATE = Date.UTC(2026, 9, 1);

const seedProducts = () =>
  products.map((product, index) => {
    const daysAgo = product.isNewArrival ? index % 7 : 20 + index;
    const createdAt = new Date(SEED_DATE - daysAgo * 24 * 60 * 60 * 1000);
    return { _id: stableId(product.slug), ...product, createdAt, updatedAt: createdAt };
  });

// Fills an empty database with the seed catalog, coupons and banners (runs at server start),
// so a fresh deployment or the in-memory dev database has sarees straight away.
const seedIfEmpty = async () => {
  const [productCount, couponCount, bannerCount] = await Promise.all([
    Product.estimatedDocumentCount(),
    Coupon.estimatedDocumentCount(),
    Banner.estimatedDocumentCount(),
  ]);

  if (productCount === 0) {
    await Product.insertMany(seedProducts(), { timestamps: false });
    console.log(`🌱 Seeded ${products.length} sarees`);
  }
  if (couponCount === 0) {
    await Coupon.insertMany(coupons);
    console.log(`🌱 Seeded ${coupons.length} coupon(s)`);
  }
  if (bannerCount === 0) {
    await Banner.insertMany(banners);
    console.log(`🌱 Seeded ${banners.length} banner(s)`);
  }
};

// Replaces the catalog, coupons and banners with the seed data (orders and subscribers stay)
const resetCatalog = async () => {
  await Promise.all([Product.deleteMany({}), Coupon.deleteMany({}), Banner.deleteMany({})]);
  await Product.insertMany(seedProducts(), { timestamps: false });
  await Coupon.insertMany(coupons);
  await Banner.insertMany(banners);
  return { products: products.length, coupons: coupons.length, banners: banners.length };
};

module.exports = { seedIfEmpty, resetCatalog, seedProducts };
