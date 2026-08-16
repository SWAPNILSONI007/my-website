const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'Silviyara_super_secret_key_2026';
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


// Create order
router.post('/', async (req, res) => {
  try {
    let { customerId, customerName, customerEmail, customerMobile, customerAddress, customerLandmark, customerCity, customerState, customerPin, items, totalAmount, paymentMethod, paymentId, razorpayOrderId, paymentStatus, giftWrap, giftMessage } = req.body;

    if (!customerName || !customerMobile || !customerAddress || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    // Basic email validation (if provided)
    if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    // If MongoDB is not connected, return an error — do not silently lose the order
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB not connected — refusing to save order to prevent data loss.');
      return res.status(503).json({ success: false, message: 'Our database is temporarily unavailable. Please try again in a moment or order via WhatsApp at +91 8004703038.' });
    }

    const orderData = {
      customerName,
      customerEmail: customerEmail || '',
      customerMobile,
      customerAddress,
      customerLandmark: customerLandmark || '',
      customerCity,
      customerState: customerState || '',
      customerPin,
      items,
      totalAmount,
      paymentMethod: paymentMethod || 'COD',
      paymentId: paymentId || '',
      razorpayOrderId: razorpayOrderId || '',
      paymentStatus: paymentStatus || 'Pending',
      giftWrap: giftWrap || false,
      giftMessage: giftMessage || ''
    };
    if (customerId) orderData.customerId = customerId;

    const order = new Order(orderData);
    await order.save();
    res.json({ success: true, orderId: order._id, orderNumber: order.orderNumber, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error placing order' });
  }
});

// Admin: Get all orders
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database temporarily unavailable' });
    }
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
      return res.status(503).json({ error: 'Database temporarily unavailable' });
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
      return res.status(503).json({ success: false, message: 'Database temporarily unavailable' });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating status' });
  }
});

module.exports = router;
