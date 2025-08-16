const router = require('express').Router();
const { createOrder, getOrder } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', createOrder); // guest checkout allowed
router.get('/:id', getOrder);

module.exports = router;
