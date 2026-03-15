const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  originalPrice: Number,
  category: {
    type: String,
    enum: ['pendant', 'ear-jewellery', 'rings', 'anklets', 'bracelets', 'necklaces', 'hair-accessories'],
    required: true
  },
  image: { type: String, default: '' },
  inStock: { type: Boolean, default: true },
  isFlashSale: { type: Boolean, default: false },
  flashSaleDiscount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);