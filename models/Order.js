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
  paymentMethod: { type: String, default: 'COD', enum: ['COD', 'Razorpay'] },
  paymentId: { type: String, default: '' },
  paymentStatus: { type: String, default: 'Pending', enum: ['Pending', 'Paid', 'Failed'] },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
