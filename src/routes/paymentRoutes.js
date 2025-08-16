const router = require('express').Router();
const { createRazorpayOrder, verifyPayment } = require('../controllers/paymentController');

router.post('/create-order', createRazorpayOrder);
router.post('/verify', verifyPayment);

module.exports = router;
