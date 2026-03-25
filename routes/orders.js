const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create order
router.post('/', async (req, res) => {
  try {
    const { customerName, customerMobile, customerAddress, customerCity, customerPin, items, totalAmount } = req.body;
    if (!customerName || !customerMobile || !customerAddress || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const order = new Order({
      customerName,
      customerMobile,
      customerAddress,
      customerCity,
      customerPin,
      items,
      totalAmount
    });
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
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Admin: Update Status
router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating status' });
  }
});

module.exports = router;
