const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) return res.json([]);
    const { category } = req.query;
    const filter = category ? { category } : {};
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get flash sale products
router.get('/flash-sale', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) return res.json([]);
    const products = await Product.find({ isFlashSale: true });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Category code map for SKU generation
const CATEGORY_CODES = {
  'pendant': 'PND', 'ear-jewellery': 'EAR', 'rings': 'RNG',
  'anklets': 'ANK', 'bracelets': 'BRC', 'necklaces': 'NCK',
  'hair-accessories': 'HAR'
};

// Auto-generate SKU: SLV-{CAT}-{NNN}
async function generateSKU(category) {
  const code = CATEGORY_CODES[category] || 'GEN';
  const prefix = `SLV-${code}-`;
  // Find highest existing SKU number for this category
  const existing = await Product.find({ sku: { $regex: `^${prefix}` } }).select('sku').lean();
  let maxNum = 0;
  existing.forEach(p => {
    const num = parseInt(p.sku.replace(prefix, ''), 10);
    if (num > maxNum) maxNum = num;
  });
  return `${prefix}${String(maxNum + 1).padStart(3, '0')}`;
}

// Add product (admin only)
router.post('/', async (req, res) => {
  try {
    // Auto-generate SKU if not provided
    if (!req.body.sku || req.body.sku.trim() === '') {
      req.body.sku = await generateSKU(req.body.category);
    }
    const product = new Product(req.body);
    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product (admin only)
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete product (admin only)
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;