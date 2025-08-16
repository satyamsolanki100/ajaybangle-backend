const router = require('express').Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { listOrders, updateStatus } = require('../controllers/orderController');
const Product = require('../models/Product');

// Orders & revenue
router.get('/orders', protect, admin, listOrders);
router.put('/orders/:id/status', protect, admin, updateStatus);

// Basic product reports (counts by category)
router.get('/reports/products', protect, admin, async (req, res) => {
  const data = await Product.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  res.json(data);
});

module.exports = router;
