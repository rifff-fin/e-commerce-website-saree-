const express = require('express');
const router = express.Router();
const { getProducts, getProductBySlug } = require('../controllers/productController');
const { rateLimiter } = require('../middleware/rateLimiter');

// Generous: the shop refetches as filters change
const browseLimit = rateLimiter({ windowMs: 60 * 1000, max: 120 });

router.get('/', browseLimit, getProducts);
router.get('/:slug', browseLimit, getProductBySlug);

module.exports = router;
