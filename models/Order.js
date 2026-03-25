const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerMobile: { type: String, required: true },
  customerAddress: { type: String, required: true },
  customerCity: { type: String, required: true },
  customerPin: { type: String, required: true },
  items: [{
    name: String,
    price: Number,
    emoji: String,
    id: String
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
