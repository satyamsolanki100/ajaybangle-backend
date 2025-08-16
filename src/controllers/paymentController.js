const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret'
});

// POST /api/payments/create-order  { amount }
const createRazorpayOrder = async (req, res) => {
  const { amount } = req.body;
  try {
    const order = await instance.orders.create({
      amount: Math.round(Number(amount) * 100), // paise
      currency: process.env.RAZORPAY_CURRENCY || 'INR'
    });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Razorpay order creation failed', error: err.message });
  }
};

// POST /api/payments/verify
const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret')
    .update(body.toString())
    .digest('hex');

  const isValid = expectedSignature === razorpay_signature;
  if (!isValid) return res.status(400).json({ message: 'Invalid signature' });

  // mark order as paid
  const order = await Order.findById(orderId);
  if (order) {
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = { razorpay_order_id, razorpay_payment_id, razorpay_signature, status: 'paid' };
    await order.save();
  }
  res.json({ success: true });
};

module.exports = { createRazorpayOrder, verifyPayment };
