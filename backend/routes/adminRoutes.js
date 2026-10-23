const express = require('express');
const router = express.Router();
const admin = require('../controllers/adminController');
const { adminAuth } = require('../middleware/adminAuth');
const { rateLimiter } = require('../middleware/rateLimiter');

// Login is limited so the password cannot be brute-forced
router.post('/login', rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }), admin.login);

// Everything below needs a valid admin token
router.use(adminAuth);

router.get('/me', admin.me);
router.get('/stats', admin.stats);

router.get('/products', admin.listProducts);
router.get('/products/:id', admin.getProduct);
router.post('/products', admin.createProduct);
router.put('/products/:id', admin.updateProduct);
router.delete('/products/:id', admin.deleteProduct);

router.get('/orders', admin.listOrders);
router.patch('/orders/:id', admin.updateOrder);
router.delete('/orders/:id', admin.deleteOrder);

router.get('/coupons', admin.listCoupons);
router.post('/coupons', admin.createCoupon);
router.put('/coupons/:id', admin.updateCoupon);
router.delete('/coupons/:id', admin.deleteCoupon);

router.get('/subscribers', admin.listSubscribers);
router.get('/subscribers.csv', admin.exportSubscribers);
router.delete('/subscribers/:id', admin.deleteSubscriber);

router.get('/banners', admin.listBanners);
router.post('/banners', admin.createBanner);
router.put('/banners/:id', admin.updateBanner);
router.delete('/banners/:id', admin.deleteBanner);

router.post('/uploads/sign', admin.signUpload);
router.post('/uploads/delete', admin.deleteUpload);

module.exports = router;
