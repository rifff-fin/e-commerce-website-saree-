const mongoose = require('mongoose');
const { TYPE_NAMES, FABRICS, OCCASIONS, COLORS } = require('../data/catalogOptions');

// Who took a licensed placeholder photo (null for the client's own photos)
const creditSchema = new mongoose.Schema(
  {
    author: { type: String, trim: true, maxlength: 120 },
    license: { type: String, trim: true, maxlength: 40 },
    licenseUrl: { type: String, trim: true, maxlength: 300 },
    source: { type: String, trim: true, maxlength: 400 },
  },
  { _id: false },
);

const imageSchema = new mongoose.Schema(
  {
    // A path under the frontend's public/products folder or a Cloudinary URL
    url: { type: String, required: true, trim: true, maxlength: 400 },
    alt: { type: String, trim: true, maxlength: 240, default: '' },
    credit: { type: creditSchema, default: null },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9-]+$/,
    },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    nameBn: { type: String, trim: true, maxlength: 120, default: '' },
    type: { type: String, required: true, enum: TYPE_NAMES },
    fabric: { type: String, required: true, enum: FABRICS },
    weave: { type: String, trim: true, maxlength: 120, default: '' },
    origin: { type: String, trim: true, maxlength: 120, default: '' },
    colors: [{ type: String, enum: COLORS.map((c) => c.name) }],
    occasions: [{ type: String, enum: OCCASIONS }],
    price: { type: Number, required: true, min: 0 },
    originalPrice: {
      type: Number,
      required: true,
      validate: {
        validator(value) {
          return value >= this.price;
        },
        message: 'originalPrice must be greater than or equal to price',
      },
    },
    withBlousePiece: { type: Boolean, default: true },
    handwoven: { type: Boolean, default: false },
    length: {
      sareeMetres: { type: Number, min: 4, max: 7, default: 5.5 },
      blouseMetres: { type: Number, min: 0, max: 1.5, default: 0.8 },
    },
    care: { type: String, trim: true, maxlength: 600, default: '' },
    description: { type: String, trim: true, maxlength: 800, default: '' },
    // The first photo is the main one; the second is shown on hover
    images: { type: [imageSchema], default: [] },
    popularity: { type: Number, default: 0 }, // higher = more popular (sales / views)
    isNewArrival: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    active: { type: Boolean, default: true }, // hidden from the store when false
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true },
  },
);

// Whole-number discount shown on the badge, e.g. 7 -> "-7%"
productSchema.virtual('discountPercent').get(function () {
  if (!this.originalPrice || this.originalPrice <= this.price) return 0;
  return Math.round((1 - this.price / this.originalPrice) * 100);
});

productSchema.index({ type: 1, price: 1 });
productSchema.index({ bestSeller: 1, popularity: -1 });

module.exports = mongoose.model('Product', productSchema);
