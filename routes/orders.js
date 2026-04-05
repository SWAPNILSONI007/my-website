const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const mongoose = require('mongoose');

// In-memory fallback for local testing when MongoDB is down
let memoryOrders = [];

// Create order
router.post('/', async (req, res) => {
  try {
    const { customerName, customerMobile, customerAddress, customerCity, customerPin, items, totalAmount, paymentMethod, paymentId, paymentStatus } = req.body;
    if (!customerName || !customerMobile || !customerAddress || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    // Fallback if DB disconnected
    if (mongoose.connection.readyState !== 1) {
      console.log('MongoDB disconnected, using in-memory fallback for order.');
      const newOrder = { 
        _id: 'ORD-' + Math.floor(Math.random() * 90000 + 10000), 
        customerName, customerMobile, customerAddress, customerCity, customerPin, items, totalAmount,
        paymentMethod: paymentMethod || 'COD',
        paymentId: paymentId || '',
        paymentStatus: paymentStatus || 'Pending',
        status: 'Pending', createdAt: new Date() 
      };
      memoryOrders.unshift(newOrder);
      return res.json({ success: true, orderId: newOrder._id });
    }

    const order = new Order({ customerName, customerMobile, customerAddress, customerCity, customerPin, items, totalAmount, paymentMethod: paymentMethod || 'COD', paymentId: paymentId || '', paymentStatus: paymentStatus || 'Pending' });
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
    if (mongoose.connection.readyState !== 1) {
      return res.json(memoryOrders);
    }
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Admin: Update Status
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
