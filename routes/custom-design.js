const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const CustomDesign = require('../models/CustomDesign');

const JWT_SECRET = process.env.JWT_SECRET || 'Silviyara_super_secret_key_2026';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'silviyara-secret-2026';

// Customer auth middleware
const customerAuth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ success: false, msg: 'Please login to access this feature' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.customer = decoded.customer;
    next();
  } catch (e) {
    res.status(400).json({ success: false, msg: 'Session expired. Please login again.' });
  }
};

// Admin auth middleware
const adminAuth = (req, res, next) => {
  const token = req.header('x-admin-token');
  if (token === ADMIN_TOKEN) return next();
  res.status(401).json({ success: false, msg: 'Admin access required' });
};

// @route POST /api/custom-design — Submit a new custom design request (Customer)
router.post('/', customerAuth, async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) return res.status(500).json({ success: false, msg: 'Database unavailable' });

    const { designTitle, description, fileName, fileType, fileData, customerName, customerEmail, customerPhone } = req.body;

    if (!designTitle) return res.status(400).json({ success: false, msg: 'Please provide a design title' });
    if (!fileData) return res.status(400).json({ success: false, msg: 'Please upload a design file' });

    const design = new CustomDesign({
      customerId: req.customer.id,
      customerName: customerName || 'Customer',
      customerEmail: customerEmail || '',
      customerPhone: customerPhone || '',
      designTitle,
      description: description || '',
      fileName: fileName || 'design-file',
      fileType: fileType || 'application/octet-stream',
      fileData
    });

    await design.save();
    res.json({ success: true, msg: 'Design submitted successfully!', design: { _id: design._id, designTitle: design.designTitle, status: design.status, createdAt: design.createdAt } });
  } catch (err) {
    console.error('Custom design submit error:', err.message);
    res.status(500).json({ success: false, msg: 'Server error. Please try again.' });
  }
});

// @route GET /api/custom-design/my — Get logged-in customer's submissions
router.get('/my', customerAuth, async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) return res.status(500).json({ success: false, msg: 'Database unavailable' });

    const designs = await CustomDesign.find({ customerId: req.customer.id })
      .select('-fileData') // Don't send file data in list
      .sort({ createdAt: -1 });
    res.json(designs);
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// @route GET /api/custom-design — Get all submissions (Admin)
router.get('/', adminAuth, async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) return res.status(500).json({ success: false, msg: 'Database unavailable' });

    const designs = await CustomDesign.find()
      .select('-fileData')
      .sort({ createdAt: -1 });
    res.json(designs);
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// @route GET /api/custom-design/:id/file — Get file data for a specific submission (Admin)
router.get('/:id/file', adminAuth, async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) return res.status(500).json({ success: false, msg: 'Database unavailable' });

    const design = await CustomDesign.findById(req.params.id).select('fileData fileType fileName');
    if (!design) return res.status(404).json({ success: false, msg: 'Design not found' });
    res.json({ success: true, fileData: design.fileData, fileType: design.fileType, fileName: design.fileName });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// @route PUT /api/custom-design/:id/status — Update status + admin note (Admin)
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) return res.status(500).json({ success: false, msg: 'Database unavailable' });

    const { status, adminNote } = req.body;
    if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, msg: 'Invalid status' });
    }

    const design = await CustomDesign.findByIdAndUpdate(
      req.params.id,
      { status, adminNote: adminNote || '', updatedAt: Date.now() },
      { new: true }
    ).select('-fileData');

    if (!design) return res.status(404).json({ success: false, msg: 'Design not found' });

    res.json({ success: true, design });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server error' });
  }
});

module.exports = router;
