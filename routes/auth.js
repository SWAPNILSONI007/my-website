const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');

const JWT_SECRET = process.env.JWT_SECRET || 'navyra_super_secret_key_2026';

// Middleware to protect routes
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

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if(!name || !email || !password) return res.status(400).json({ success: false, msg: 'Please enter all required fields' });
    
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) return res.status(500).json({ success: false, msg: 'Database unavailable' });

    let customer = await Customer.findOne({ email });
    if (customer) return res.status(400).json({ success: false, msg: 'Customer already exists' });

    customer = new Customer({ name, email, phone, password });
    
    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    customer.password = await bcrypt.hash(password, salt);
    await customer.save();

    // Sign JWT
    const payload = { customer: { id: customer.id } };
    jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ success: true, token, customer: { id: customer.id, name: customer.name, email: customer.email } });
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({ success: false, msg: 'Please enter all fields' });

    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) return res.status(500).json({ success: false, msg: 'Database unavailable' });

    let customer = await Customer.findOne({ email });
    if (!customer) return res.status(400).json({ success: false, msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) return res.status(400).json({ success: false, msg: 'Invalid Credentials' });

    const payload = { customer: { id: customer.id } };
    jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ success: true, token, customer: { id: customer.id, name: customer.name, email: customer.email, phone: customer.phone } });
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// @route GET /api/auth/profile
router.get('/profile', auth, async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) return res.status(500).json({ success: false, msg: 'Database unavailable' });

    const customer = await Customer.findById(req.customer.id).select('-password');
    res.json({ success: true, customer });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server error' });
  }
});

module.exports = router;
