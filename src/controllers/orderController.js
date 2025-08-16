const Order = require('../models/Order');
const sendEmail = require('../utils/sendEmail');

// POST /api/orders  (COD or Razorpay pre-create)
const createOrder = async (req, res) => {
  const order = await Order.create(req.body);

  // Send email to customer (if provided)
  try {
    if (req.body.email) {
      await sendEmail({
        to: req.body.email,
        subject: 'Order Placed - Ajay Bangle',
        html: `<p>Thank you for your order!</p><p>Order ID: ${order._id}</p><p>Total: ₹${order.totalPrice}</p>`
      });
    }
    // Admin email (optional): process.env.SMTP_USER
    if (process.env.SMTP_USER) {
      await sendEmail({
        to: process.env.SMTP_USER,
        subject: 'New Order Received - Ajay Bangle',
        html: `<p>New order placed.</p><p>Order ID: ${order._id}</p><p>Total: ₹${order.totalPrice}</p>`
      });
    }
  } catch (e) {
    // don't fail the order on email error
    console.error('Email error:', e.message);
  }

  res.status(201).json(order);
};

// GET /api/orders/:id
const getOrder = async (req, res) => {
  const o = await Order.findById(req.params.id).populate('items.product', 'name images price');
  if (!o) return res.status(404).json({ message: 'Order not found' });
  res.json(o);
};

// PUT /api/orders/:id/status (Admin)
const updateStatus = async (req, res) => {
  const { status, isDelivered } = req.body;
  const o = await Order.findById(req.params.id);
  if (!o) return res.status(404).json({ message: 'Order not found' });
  if (status) o.status = status;
  if (typeof isDelivered === 'boolean') {
    o.isDelivered = isDelivered;
    o.deliveredAt = isDelivered ? new Date() : null;
  }
  await o.save();
  res.json(o);
};

// GET /api/orders (Admin, with basic stats)
const listOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  const revenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  res.json({ count: orders.length, revenue, orders });
};

module.exports = { createOrder, getOrder, updateStatus, listOrders };
