const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'navyra_super_secret_key_2026';
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ success: false, msg: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.customer = decoded.customer;
    next();
  } catch (e) {
    res.status(400).json({ success: false, msg: 'Token is not valid' });
  }
};

// In-memory fallback for local testing when MongoDB is down
let memoryOrders = [];

// Create order
router.post('/', async (req, res) => {
  try {
    let { customerId, customerName, customerEmail, customerMobile, customerAddress, customerLandmark, customerCity, customerState, customerPin, items, totalAmount, paymentMethod, paymentId, razorpayOrderId, paymentStatus } = req.body;
    if (!customerName || !customerMobile || !customerAddress || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    // Basic email validation (if provided)
    if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }
    
    // Fallback if DB disconnected
    if (mongoose.connection.readyState !== 1) {
      console.log('MongoDB disconnected, using in-memory fallback for order.');
      const newOrder = { 
        _id: 'ORD-' + Math.floor(Math.random() * 90000 + 10000), 
        customerId: customerId || null,
        customerName, customerEmail: customerEmail || '', customerMobile, customerAddress, customerLandmark: customerLandmark || '', customerCity, customerState: customerState || '', customerPin, items, totalAmount,
        paymentMethod: paymentMethod || 'COD',
        paymentId: paymentId || '',
        razorpayOrderId: razorpayOrderId || '',
        paymentStatus: paymentStatus || 'Pending',
        status: 'Pending', createdAt: new Date() 
      };
      memoryOrders.unshift(newOrder);
      return res.json({ success: true, orderId: newOrder._id });
    }

    const orderData = {
      customerName, customerEmail: customerEmail || '', customerMobile, customerAddress, customerLandmark: customerLandmark || '', customerCity, customerState: customerState || '', customerPin, items, totalAmount,
      paymentMethod: paymentMethod || 'COD', paymentId: paymentId || '', razorpayOrderId: razorpayOrderId || '', paymentStatus: paymentStatus || 'Pending'
    };
    if (customerId) orderData.customerId = customerId;

    const order = new Order(orderData);
    await order.save();
    res.json({ success: true, orderId: order._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin: Get all orders
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) return res.json(memoryOrders);
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get logged-in user's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const myOrders = memoryOrders.filter(o => String(o.customerId) === req.customer.id || o.customerEmail === req.customer.email);
      return res.json(myOrders);
    }
    const orders = await Order.find({ 
      $or: [{ customerId: req.customer.id }, { customerEmail: req.customer.email }] 
    }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Track order (Guest)
router.post('/track', async (req, res) => {
  try {
    const { orderId, contact } = req.body; // contact can be email or phone
    if (!orderId || !contact) return res.status(400).json({ success: false, msg: 'Order ID and Email/Phone required' });

    let order = null;
    if (mongoose.connection.readyState !== 1) {
      order = memoryOrders.find(o => String(o._id) === orderId && (o.customerEmail === contact || o.customerMobile === contact));
    } else {
      order = await Order.findOne({ 
        _id: orderId, 
        $or: [{ customerEmail: contact }, { customerMobile: contact }]
      });
    }

    if (!order) return res.status(404).json({ success: false, msg: 'Order not found or contact details mismatch' });
    res.json({ success: true, order });
  } catch (err) {
    if (err.kind === 'ObjectId') return res.status(404).json({ success: false, msg: 'Invalid Order ID format' });
    res.status(500).json({ error: 'Server error' });
  }
});

// Update order status (Admin)
router.put('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const order = memoryOrders.find(o => o._id === req.params.id);
      if (order) { order.status = req.body.status; return res.json({ success: true, order }); }
      return res.status(404).json({ success: false, message: 'Not found in memory' });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating status' });
  }
});

module.exports = router;
