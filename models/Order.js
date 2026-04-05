const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerEmail: { type: String, default: '' },
  customerMobile: { type: String, required: true },
  customerAddress: { type: String, required: true },
  customerLandmark: { type: String, default: '' },
  customerCity: { type: String, required: true },
  customerState: { type: String, default: '' },
  customerPin: { type: String, required: true },
  items: [{
    name: String,
    price: Number,
    qty: { type: Number, default: 1 },
    emoji: String,
    id: String
  }],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'COD', enum: ['COD', 'Razorpay'] },
  paymentId: { type: String, default: '' },
  razorpayOrderId: { type: String, default: '' },
  paymentStatus: { type: String, default: 'Pending', enum: ['Pending', 'Paid', 'Failed'] },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
