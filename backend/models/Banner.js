const mongoose = require('mongoose');

// A homepage hero slide, editable from the admin panel. The hero cross-fades between the
// active banners in `order`.
const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 90 },
    subtitle: { type: String, trim: true, maxlength: 200, default: '' },
    image: { type: String, required: true, trim: true, maxlength: 400 },
    alt: { type: String, trim: true, maxlength: 240, default: '' },
    ctaLabel: { type: String, trim: true, maxlength: 40, default: '' },
    ctaHref: { type: String, trim: true, maxlength: 200, default: '' }, // a store path, e.g. /shop?type=jamdani
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: { versionKey: false } },
);

module.exports = mongoose.model('Banner', bannerSchema);
