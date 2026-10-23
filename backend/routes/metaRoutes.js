const express = require('express');
const router = express.Router();
const { getMeta, getBanners } = require('../controllers/metaController');

router.get('/', getMeta);
router.get('/banners', getBanners);

module.exports = router;
